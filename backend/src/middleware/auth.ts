import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401).json({ error: 'No Autorizado' });
        return;
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        res.status(401).json({ error: 'No Autorizado' });
        return;
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password');
            if (!user) {
                res.status(404).json({ error: 'El Usuario no existe' });
                return;
            }
            req.user = user;
            return next(); 
        }

        res.status(401).json({ error: 'Token inválido' });
        return;

    } catch (error) {
        res.status(401).json({ error: 'Token No Válido' });
        return;
    }
};
