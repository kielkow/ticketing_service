import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@kielkow_tickets/common';

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.post(
    '/api/users/signin', 
    [
        body('email')
        .isEmail()
        .withMessage('E-mail must be valid'),
        body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            throw new BadRequestError('Invalid e-mail');
        }
        
        const passwordsMatch = await Password.compare(existingUser.password, password);
        
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid password');
        }
        
        // Generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);
        
        // Store it on session object
        req.session = {
            jwt: userJwt
        };
        
        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
