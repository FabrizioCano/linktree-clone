import {NextFunction, Request,Response} from 'express';
import jwt from 'jsonwebtoken';

import { validationResult } from 'express-validator';

export const handleInputErrors = (req:Request, res:Response,next:NextFunction) => {
  //manejar errores
  let errors=validationResult(req);

  if (!errors.isEmpty()){
    res.status(400).json({errors: errors.array()});
  }

  next()
}