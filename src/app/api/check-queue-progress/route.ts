import { NextResponse } from "next/server";

const client_key = process.env.SNAPVALID_API_KEY || "";
const host = process.env.SNAPVALID_API_HOST || "";

interface checkQueueProgressResponse {
    queue_size?: number;
    message?: string;
}
export async function GET() {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const response = await fetch(`${host}/api/check-queue-progress/?api_key=${client_key}`, options);
    const data = await response.json() as checkQueueProgressResponse;
    if(data.queue_size && data.queue_size > 0){
        return NextResponse.json({ status: "Inprogress" })
    }
    return NextResponse.json({ status: "Completed" })
}
