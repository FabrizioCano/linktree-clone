import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

//para comunicar la propiedad user del objeto Request a los controladores
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Agregar la propiedad user al objeto Request
        }
    }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No autorizado')
        res.status(401).json({ error: error.message })
    }

    // Extraer el token del encabezado Authorization
    const [, token] = bearer.split(' ');

    if (!token) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
    }

    //se debe verificar el token y extraer el id del usuario
    try {
        //si el token es valido, se extrae el id del usuario
        const result = jwt.verify(token, process.env.JWT_SECRET);
        //extraer el id del usuario del token y obtener el usuario de la base de datos
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
            }
            req.user=user
            next();
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no valido' });
    }

}