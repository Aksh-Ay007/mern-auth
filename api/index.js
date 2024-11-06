import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.routes.js'
dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{

    console.log('connected to monogoDb')
}).catch((err)=>{

    console.log(err);
})

const app = express();
app.use(express.json())

app.listen(5000, () => {
    console.log('Server is running on port 3000');
});

app.use("/api/user",userRoutes);
app.use('/api/auth',authRoutes);

app.use((err,req,res,next)=>{

    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error';

    return res.status(statusCode).json({

        success:false,
        message,
        statusCode,
    });
});
