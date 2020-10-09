import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
    '/api/users/signup', 
    [
        body('email')
        .isEmail()
        .withMessage('E-mail must be valid'),
        body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 chars')
    ], 
    (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Invalid email or password');

            const reasons = errors.array();

            throw { error, reasons };
        }

        console.log('Creating a user...');
        throw new Error('Error connecting to database');

        res.send({});
    }
);

export { router as signupRouter };
