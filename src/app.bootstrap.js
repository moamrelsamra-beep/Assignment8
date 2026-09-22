import express from "express"
import  connectDB from "./DB/connectionDB.js"
import userModel  from "./DB/models/user.model.js"
import router from "./modules/users/user.controller.js"
import Noterouter from "./modules/notes/note.controller.js"
 const app = express()
 const port =3000



   const bootstrap= async () => {
      
   app.use(express.json())
   app.get('/',(req,res)=> res.status(200).json({msg: "Hello world"}))
   
      app.use('/users', router)
      app.use('/notes', Noterouter)

     await connectDB();
          
   app.use("{/*demo}",(req,res)=>{
       res.status(404).json({
           message:`req with url:${req.originalUrl} with method:${req.method} not found`,
           status:404
       })
   })
   app.listen(port, () => 
   console.log(`App is listening on port ${port}`))
   }
   
   export default bootstrap 
