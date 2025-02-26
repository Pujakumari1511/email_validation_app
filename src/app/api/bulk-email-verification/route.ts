import { NextRequest, NextResponse } from 'next/server';


const client_key = process.env.SNAPVALID_API_KEY || "";
const host = process.env.SNAPVALID_API_HOST || "";

interface bulkEmailUploadResponse {
    status: number;
    file_uploads_id: number;
}

const snapValidBulkEmailValidation = async (file: File): Promise<number | undefined> => {
    const formdata = new FormData();
    formdata.append("file", file, file.name);

    const options = {method: 'POST', headers: { accept: 'application/json' }, body: formdata };
    console.log(host);
    console.log(client_key);

    const response = await fetch(`${host}/api/upload-bulk-emails?api_key=${client_key}`, options);
    const data = await response.json() as bulkEmailUploadResponse;
    console.log(data);
    if(data.status === 200){
        return data.file_uploads_id
    }
}


export async function POST(request: NextRequest){
    
    const formdata = await request.formData();
    const file = formdata.get("file") as File;
    if (!file) {
        return NextResponse.json({ error: "No file received" }, { status: 400 })
    }
    const bulkEmailUploadId = await snapValidBulkEmailValidation(file);
    if(!bulkEmailUploadId){
        return NextResponse.json({ Message: "Error" }, { status: 500 });
    }
   
    return NextResponse.json({ Message: "Success", BulkEmailUploadId: bulkEmailUploadId });
};

