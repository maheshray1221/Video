// v2 as cloudinary iska matlb v2 ka name change hoke cloudinary ha gya
import dotenv from 'dotenv';
dotenv.config( {path:'./.env' });
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload the file in Cloudinary
const uploadOnCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) return null
        // upload the file in Cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto" // khud hi detact kro kya type hai
        })
        //file has been upload successfully
        fs.unlinkSync(localfilePath)  
        return response;
    } catch (err) {
        fs.unlinkSync(localfilePath)
        // console.log("maheshHero",err) // unlink-> delete
        /* remove the locally saved temprary file as the upload 
        opration got failed 
        */
        return null;
    }
}

export { uploadOnCloudinary }