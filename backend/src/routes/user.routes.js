import express from 'express' ;
import zod from 'zod' ;
import User from "../model/user.js";
import Account from '../model/account.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt' ;
import { authMiddleware } from '../middleware/index.js';

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

        await Account.create({
            userId,
            balance : 1 + Math.random()*1000
        })

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
});

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    try {
        if (!success) {
            res.status(411).json({
                message: "Error while updating information"
            })
        }
    
        await User.updateOne(req.body, {
            id: req.userId
        })
    
        res.json({
            message: "Updated successfully"
        })
    } catch (error) {
        console.log("Something went wrong" , error)
    }
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    try {
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        })
    
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
    } catch (error) {
        console.log("Something went wrong while filtering")
    }
})

export default router ;