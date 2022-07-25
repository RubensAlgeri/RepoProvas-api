import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export async function validateToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        
        throw{type:401,message:"Token invalid!"}
    }
    
    next();
}