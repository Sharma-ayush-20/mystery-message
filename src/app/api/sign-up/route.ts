import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/model/user-model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  //make a database connection after hitting an api
  await dbConnect();

  try {
    //take details from request
    let { username, email, password } = await request.json();
    //checking in database that user by this username and is Verified = true is present
    let existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    //username is already present and verified too
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }

    let exisitingUserByEmail = await userModel.findOne({ email });
    //generate random code (otp)
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    //user exist with this email
    if (exisitingUserByEmail) {
      //user is verified 
        if(exisitingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: "User is already exist with this email"
            }, {status: 500})
        }
        //user is not verified
        else{
            const hashPassword = await bcrypt.hash(password, 10);
            exisitingUserByEmail.password = hashPassword;
            exisitingUserByEmail.verifyCode = verifyCode;
            exisitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000).toISOString()
            await exisitingUserByEmail.save();
        }

    } else {
      //register new User
      const hashPassword = await bcrypt.hash(password, 10);
      //expiry date for 1 hours
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hashPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        messages: [],
        isAcceptingMessage: true,
      });

      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Registered successFully. please verify your email",
      },
      { status: 200 },
    );
  } catch (error) {
    //error for terminal
    console.error("Error Registrating user", error);
    //error send to frontend
    return Response.json(
      {
        success: false,
        message: "Error Registrating User",
      },
      {
        status: 500,
      },
    );
  }
}
