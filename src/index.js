import connectDB from "./db/index.js";
import dotenv from "dotenv"
import {app} from 'app.js'
dotenv.config()

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