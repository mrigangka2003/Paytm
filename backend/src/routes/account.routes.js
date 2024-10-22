import express from 'express' 
import { authMiddleware } from '../middleware/index.js'
import Account from '../model/account.js'
import mongoose from 'mongoose' ;

const router = express.Router() ;

router.get('/balance',authMiddleware,async(req,res)=>{
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        res.json({
            balance : account.balance 
        })
    } catch (error) {
        console.log("Something went wrong while getting balance")
        res.status(411).json({message:"Something went wrong"})
    }
});


router.post('/transfer',authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    try {
        const account = await Account.findOne({
            userId: req.userId,
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account",
            });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: +amount } }
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.json({
            message: "Transfer successful",
        });
    } catch (e) {
        await session.abortTransaction(); 
        session.endSession();
        console.log("Error during transaction:", e);
        return res.status(500).json({
            message: "Something went wrong while sending money",
        });
    }
})


export default router ;