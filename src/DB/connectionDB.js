import mongoose from 'mongoose';


const connectDB= async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/mohamed')
    .then(() =>{
        console.log("DB connected successfully");
        
    })
    .catch((error)=> {
         console.log(error, "DB connection failed");
         
    }
)}
export default connectDB