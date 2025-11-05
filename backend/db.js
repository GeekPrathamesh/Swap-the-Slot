import mongoose from "mongoose";

const CONNECTDB=()=>{

    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected successfully");
    });
}

export default CONNECTDB;

