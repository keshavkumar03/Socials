import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv  from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import  Path  from "path";
import 'dotenv/config';
import {register} from "./controllers/auth.js";
import authroute from "./route/auth.js";
import { fileURLToPath } from "url";

/*configurations*/
const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)
dotenv.config({path:`server/.env`})

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assests",express.static(Path.join(__dirname,'public/assets')));

/*file storage*/ 
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload =multer({storage});

/* routes within file system*/
 app.post("auth/register", upload.single("picture"),register)

/*mongoose */

const PORT = process.env.PORT ;
 const Mongodb = process.env.MONGO_URL
 mongoose.connect(Mongodb,{
     useNewUrlParser:true,
     useUnifiedTopology:true,
 }).then(()=>{
     app.listen(PORT,()=>console.log(`Server Port: ${PORT}`))
 }).catch((error)=>console.log(`${error} did not connect`)) 
