import User from "../models/user.modal.js";
import becryptjs from'bcryptjs'
import { errorHandler } from "../utils/error.js";
import  jwt    from "jsonwebtoken";

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



export const signin=async(req,res,next)=>{

   const{email,password}=req.body;

   try {
      //checking it is a valid user

      const validUser=await User.findOne({email})
      if(!validUser)return next(errorHandler(404,'user not found'))
      const validPassword=becryptjs.compareSync(password,validUser.password)
   if(!validPassword)return next(errorHandler(401,'please check correct password and email'))

   const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
   const{password:hashedPassword,...rest}=validUser._doc;
   const expiryDate=new Date(Date.now()+3600000);//1hour

res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest) ; //putting token on the cookie of the browserrr //httpOnly true is used to prevent to modify token from 3rd party
   } catch (error) {
      next(error)
   }

}



//google


export const google = async (req, res, next) => {
   try {
     const user = await User.findOne({ email: req.body.email });
     if (user) {
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
       const { password: hashedPassword, ...rest } = user._doc;
       const expiryDate = new Date(Date.now() + 3600000); // 1 hour
       res
         .cookie('access_token', token, {
           httpOnly: true,
           expires: expiryDate,
         })
         .status(200)
         .json(rest);
     } else {
       const generatedPassword =
         Math.random().toString(36).slice(-8) +
         Math.random().toString(36).slice(-8);
       const hashedPassword = becryptjs.hashSync(generatedPassword, 10);
       const newUser = new User({
         username:
           req.body.name.split(' ').join('').toLowerCase() +
           Math.random().toString(36).slice(-8),
         email: req.body.email,
         password: hashedPassword,
         profilePicture: req.body.photo,
       });
       await newUser.save();
       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
       const { password: hashedPassword2, ...rest } = newUser._doc;
       const expiryDate = new Date(Date.now() + 3600000); // 1 hour
       res
         .cookie('access_token', token, {
           httpOnly: true,
           expires: expiryDate,
         })
         .status(200)
         .json(rest);
     }
   } catch (error) {
     next(error);
   }
 };