import express from 'express' ;
import zod, { ZodNaN } from 'zod' ;
import User from "../model/user.js"
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../constants.js';

const router = express.Router() ;

const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName :zod.string(),
    lastName : zod.string() 
    
});

router.post('/signup',async(req,res)=>{
    const body = req.body ;
    const {success} = signupSchema.safeParse(req.body) ;

    try {
        if(!success){
            return res.status(411).json({
                message :"Incorrect Inputs" 
            })
        }
        const user = await User.findOne({
            username : body.username
        }) ;


        if(user._id){
            return res.status(411).json({
                message :"Username Taken"
            })
        }
        const newUser = await User.create(body) ;

        const token = jwt.sign({
            userId : newUser._id
        },JWT_SECRET)

        return res.status(200).json({
            message :"User created Successfully",
            token : token
        })

    } catch (error) {
        console.log("Something went wrong!") ;
    }
});

const signingBody = zod.object({
    username : zod.string().email() ,
    password : zod.string()
})


router.post('/signin',async(req,res)=>{
    const {success} = signingBody.safeParse(req.body) ;

    try{
        if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });

        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });
    }

    }catch(err){

    }
})
export default router ;