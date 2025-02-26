import { NextRequest, NextResponse } from "next/server";
import { EmailVerification } from "@/types/api";

const clint_key = process.env.SNAPVALID_API_KEY || "";
const host = process.env.SNAPVALID_API_HOST || "";

const emailValidation = async (email: string): Promise<EmailVerification | undefined> => {
    const requestURL = new URL(host)
    requestURL.pathname = "api/v1/verify/"
    requestURL.searchParams.set('apikey', clint_key)
    requestURL.searchParams.set('email', email)

    const options = {method: 'GET', headers: {accept: 'application/json'}};
    try {
        const response = await fetch(requestURL.toString(), options);
        const data = await response.json() as EmailVerification;
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if(!email){
        return NextResponse.json({message: "No email was provided"})
    }
    const response = await emailValidation(email);
    if(response){
        return NextResponse.json(response);
    }
    return NextResponse.json({message: "error validating email"})   
}
