import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject = {}

export const dbConnect = async (): Promise<void> => {
    //check that database connection is already there
    if(connection.isConnected){
        console.log("Already Connected to database")
        return;
    }
    //make newly connection
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})

        console.log(db);

        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected SuccessFully");

    }catch(error){
        console.log("Database Connection Failed !!", error)
        process.exit(1)
    }
}