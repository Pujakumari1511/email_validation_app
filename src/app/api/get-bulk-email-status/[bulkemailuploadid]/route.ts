import { NextResponse, NextRequest } from "next/server";
import AdmZip from "adm-zip";
import fs from 'fs';
import path from "path";
import readline from 'readline';


const client_key = process.env.SNAPVALID_API_KEY || "";
const host = process.env.SNAPVALID_API_HOST || "";


interface DownloadFileResponse {
    status: number;
    zip: string;
    message: string;
    download_url: string;
}

interface EmailStatus{
    email: string;
    status: string;
}

const outputDir = './temp/';

const getDownloadUrl = async (bulkemailuploadid: string): Promise<string> => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const response = await fetch(`${host}/api/downloadCsv/?api_key=${client_key}&file_uploads_id=${bulkemailuploadid}&typeDownload=.txt`, options);

    const data = await response.json() as DownloadFileResponse;
    return data.download_url;
}

const downloadAndExtractResponse = async (downloadUrl: string): Promise<EmailStatus[]> => {
    const downloadedFile = await fetch(downloadUrl);

        const arrayBuffer = await downloadedFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const zip = new AdmZip(buffer);
        zip.extractAllTo(outputDir, true);

        const files = fs.readdirSync(outputDir);
        const emails: EmailStatus[] = []

        const extractStatus = (filename: string) => {
            return filename
            .replace(/\d+|_\d+|\.txt/g, '') 
            .replace(/_/g, ' ') 
            .trim()
            .replace(/^\w/, (c) => c.toUpperCase());
        } 

        for (const file of files) {
            const filePath = path.join(outputDir, file);

            if (path.extname(file).toLowerCase() === '.txt' && fs.statSync(filePath).size > 0) {
                const fileStream = fs.createReadStream(filePath);
                const rl = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });
                for await (const email of rl) {
                    const emailstatus: EmailStatus = {
                        email: email,
                        status: extractStatus(file)
                    }
                    emails.push(emailstatus);
                } 
            }
            fs.unlinkSync(filePath); // delete file
        }
        return emails;
}

const deleteFromSnapValid = async (bulkemailuploadid: string) => {
    const options = {method: 'DELETE', headers: {accept: 'application/json'}};

    const response = await fetch(`${host}/api/deleteFileUpload/?api_key=${client_key}&file_uploads_id=${bulkemailuploadid}`, options);
    if(response.status !== 200){
        console.log(`Job ${bulkemailuploadid} not deleted from Snapvalid`)
    }
}

export async function GET(request: NextRequest, { params }: { params: { bulkemailuploadid: string } }){
    try{
        const { bulkemailuploadid } = await params;

        const downloadUrl = await getDownloadUrl(bulkemailuploadid);

        const emails = await downloadAndExtractResponse(downloadUrl);

        await deleteFromSnapValid(bulkemailuploadid);

        return NextResponse.json(emails);

    }
    catch(error){
        console.log(error);
        return NextResponse.json({ status: "Server Error"}, { status: 500 })
    }
    
}
