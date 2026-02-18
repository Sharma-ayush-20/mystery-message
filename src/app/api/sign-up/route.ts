import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/model/user-model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {

        
        
    } catch (error) {
        //error for terminal
        console.error("Error Registrating user", error);
        //error send to frontend
        return Response.json(
            {
                success: false,
                message: "Error Registrating User"
            },{
                status: 500
            }
        )
    }
}