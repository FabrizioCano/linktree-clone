import {Router} from 'express'
import {body} from 'express-validator'
import {createAccount, getUser, login, updateProfile} from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

const router=Router()

/* Autenticacion */
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handle es obligatorio, no puede estar vacío'),
    body('name')
        .notEmpty()
        .withMessage('El nombre es obligatorio, no puede estar vacío'),
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .isLength({min: 8})
        .withMessage('La contraseña es muy corta, debe tener al menos 8 caracteres'),
        handleInputErrors,
    createAccount)

//inicio de sesion
router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
        body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
        handleInputErrors,
    login
)
//obtener informacion del usuario autenticado
//se utiliza el middleware authenticate para verificar el token de autenticacion
router.get('/user',authenticate,getUser)
router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El handle es obligatorio, no puede estar vacío'),
    body('description')
        .notEmpty()
        .withMessage('La descripcion es obligatoria, no puede estar vacía'),
    handleInputErrors,
    authenticate,
    updateProfile)

export default router