import { RequestHandler } from 'express';
import { check, validationResult } from 'express-validator';
import slug from 'slug';
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from '../utils/jwt';
export const createAccount: RequestHandler = async (req, res) => {

  const { email,password } = req.body;
  //validat si el email es valido
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409).json({ error: 'Un usuario con ese email ya esta registrado' });
  }
  //validar si el password es valido
  const handle=slug(req.body.handle,'')
  const handleExists = await User.findOne({ handle });
  if (handleExists) {
    res.status(409).json({ error: 'El handle ya está en uso' });
  }

  //crear el usuario con un nuevo objeto User pasando el body del request y guardarlo en la base de datos
  const user = new User(req.body);
  user.password=await hashPassword(password)
  user.handle=handle

  await user.save();

  res.status(201).send('Usuario creado correctamente');
};

export const login: RequestHandler = async (req, res) => {
  
  const { email,password } = req.body;
  //comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: 'El usuario no existe' });
  }

  //comprobar contraseña
  const isMatch = await checkPassword(password, user.password);
  if (!isMatch) { 
    res.status(401).json({ error: 'La contraseña es incorrecta' });
  }

  const token=generateJWT({id:user._id})

  res.send(token)

}