import User from "../models/user.modal.js";
import becryptjs from'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signup=async(req,res,next)=>{

   //need to save this data to database

   const{username,email,password}=req.body;
   const hashedPassword=becryptjs.hashSync(password,10)

   const newUser=new User({username,email,password:hashedPassword});

   try {
      await  newUser.save()   //here we use await bcs tell js to untill geting the data stay in this line
      res.status(201).json({message:"user created successfully"})
   } catch (error) {
next(error)
   }
}
