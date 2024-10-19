import express from 'express' ;

const router = express.Router() ;

router.get('/',(req,res)=>{
    res.send("hey hi from api/user/v1")
})

export default router ;