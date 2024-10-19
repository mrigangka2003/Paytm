import mongoose from 'mongoose' ;

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/paytm`) ;
        console.log(`\n MongoDB connected !! DB Host :${connectionInstance.connection.host}`);
    }catch(e){
        console.log(`MongoDb connection Failed`, error);
        process.exit(1) ;
    }
}

export default connectDB ;