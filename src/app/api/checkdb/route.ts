import dbConnect from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET() {
    const con = await dbConnect();
    console.log("hit db connect", new Date().getSeconds());
    return new NextResponse("connected");
    console.log(con);

    // return NextResponse.json({ messsage: "Hello World" });
}
