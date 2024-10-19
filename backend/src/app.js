import express from 'express'
import connectDB from './db/index.js';
import dotenv from 'dotenv';
import mainRouter from "./routes/index.js"
import cors from 'cors'
const app = express() ;

dotenv.config({
    path:"./.env"
});

app.use(cors()) ;
app.use(express.json());


app.use('/api/v1', mainRouter);


connectDB()
.then(()=>{
    app.listen(8000 , ()=>{
        console.log(`Server is running on the port http://localhost:8000`);
    })
})
.catch((err)=>{
    console.log('Connection Failed !' , err) 
})

