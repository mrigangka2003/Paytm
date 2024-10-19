import express from 'express' ;
import zod, { ZodNaN } from 'zod' ;
import User from "../model/user.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt' ;


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
    const {success ,data, error} = signupSchema.safeParse(req.body) ;

    try {
        if(!success){
            return res.status(411).json({
                message :"Incorrect Inputs",
                error : error.errors
            })
        }
        const user = await User.findOne({
            username : data.username
        }) ;

        


        if(user._id){
            return res.status(411).json({
                message :"Username Taken"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10) ;
        const newUser = await User.create({
            username:data.username,
            firstName:data.firstName,
            lastName:data.lastName,
            password:hashedPassword
        }) ;

        const token = jwt.sign({
            userId : newUser._id
        },JWT_SECRET)

        return res.status(200).json({
            message :"User created Successfully",
            token : token
        })

    } catch (error) {
        console.error("Something went wrong!", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
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
        }
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });

        if(user){
            const token = jwt.sign({
                userId : user._id
            },JWT_SECRET) ;

            res.json({
                token :token
            })
            return ;
        }

    }catch(err){
        console.log('Something went wrong when signing' , err) ;
    }
})
export default router ;