import dotenv from 'dotenv';
dotenv.config( {path:'../.env' });

import connectDB from "./db/index.js";
import {app} from './app.js'


connectDB()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running in port ${port}`);
        })
    })
    .catch((err) => {
        console.log("mongo db connection failed", err);
    })