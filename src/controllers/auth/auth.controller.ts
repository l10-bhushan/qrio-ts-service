import type { Request , Response } from "express";
import { prisma } from "../../config/db.ts";
import type { UserSignup } from "../../types/user.model.ts";

const handleUserRegisteration = async (req : Request , res: Response) => {
    const user : UserSignup = req.body;

    const emailExists = await prisma.user.findUnique({
        where: {
            email : user.email
        }
    });

    const usernameExists = await prisma.user.findUnique({
        where : {
            username : user.username
        }
    })

    const error_field = emailExists ? "Email" : usernameExists ? "Username" : " "
    if(error_field) {
        res.status(409).json({
            error : `Account with ${error_field} already exists, please use a different ${error_field}`
        })
    }
}

const handleUserLogin = (req : Request , res: Response) => {

}

const handleUserLogout = (req: Request , res: Response) => {

}

export { handleUserRegisteration , handleUserLogin , handleUserLogout}