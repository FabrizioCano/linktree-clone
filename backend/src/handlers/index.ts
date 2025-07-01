import { RequestHandler } from 'express';
import { check, validationResult } from 'express-validator';
import slug from 'slug';
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
export const createAccount: RequestHandler = async (req, res) => {

  const { email,password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409).json({ error: 'Un usuario con ese email ya esta registrado' });
  }

  const handle=slug(req.body.handle,'')
  const handleExists = await User.findOne({ handle });
  if (handleExists) {
    res.status(409).json({ error: 'El handle ya está en uso' });
  }

  const user = new User(req.body);
  user.password=await hashPassword(password)
  user.handle=handle

  await user.save();

  res.status(201).send('Usuario creado correctamente');
};

export const login: RequestHandler = async (req, res) => {
  
  const { email,password } = req.body;
  //comprobar si el usuario existe
  const userExists = await User.findOne({ email });
  if (!userExists) {
    res.status(401).json({ error: 'El usuario no existe' });
  }

  //comprobar contraseña
  const isMatch = await checkPassword(password, userExists.password);
  if (!isMatch) { 
    res.status(401).json({ error: 'La contraseña es incorrecta' });
  }

  

}