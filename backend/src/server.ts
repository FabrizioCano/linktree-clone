import express from 'express'
import cors from 'cors'
import router from './router'
import {connectDB} from './config/db'
import { corsConfig } from './config/cors'

connectDB()
const app=express()

//cors
app.use(cors(corsConfig))

//Leer datos de formulario
app.use(express.json())

app.use('/', router)

export default app