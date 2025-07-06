import { json, RequestHandler } from 'express';
import { check, validationResult } from 'express-validator';
import slug from 'slug';
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from '../utils/jwt';
import cloudinary from '../config/cloudinary';
export const createAccount: RequestHandler = async (req, res) => {

  const { email, password } = req.body;
  //validat si el email es valido
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409).json({ error: 'Un usuario con ese email ya esta registrado' });
  }
  //validar si el password es valido
  const handle = slug(req.body.handle, '')
  const handleExists = await User.findOne({ handle });
  if (handleExists) {
    res.status(409).json({ error: 'Nombre de usuario no disponible' });
  }

  //crear el usuario con un nuevo objeto User pasando el body del request y guardarlo en la base de datos
  const user = new User(req.body);
  user.password = await hashPassword(password)
  user.handle = handle

  await user.save();

  res.status(201).send('Usuario creado correctamente');
};

export const login: RequestHandler = async (req, res) => {

  const { email, password } = req.body;
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

  const token = generateJWT({ id: user._id })

  res.send(token)

}

export const getUser: RequestHandler = async (req, res) => {
  res.json(req.user);
}

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const { description,links } = req.body;
    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({ handle });
    if (handleExists && handleExists.email !== req.user.email) {
      res.status(409).json({ error: 'Nombre de usuario no disponible' });
    }

    //actualizar el handle y la descripcion del usuario autenticado
    req.user.description = description;
    req.user.handle = handle;
    req.user.links=links
    await req.user.save();
    res.send('Perfil actualizado correctamente');

  } catch (e) {
    const error = new Error('Error al actualizar el perfil');
    res.status(500).json({ error: error.message });
  }
}

export const uploadImage: RequestHandler = async (req, res) => {
  //configurar las caracteristicas de upload de la imagen
  const form = formidable({
    multiples: false
  })

  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
        if (error) {
          const error = new Error('Hubo un error al subir la imagen')
          res.status(500).json({ error: error.message })
        }

        if (result) {
          req.user.image=result.secure_url
          await req.user.save()
          res.json({image:result.secure_url})
        }
      })
    })


  } catch (e) {
    const error = new Error('Error al subir la imagen');
    res.status(500).json({ error: error.message });
  }
}