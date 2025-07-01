
import server from './server'
const port=process.env.PORT || 3000
//configuraciones iniciales
server.listen(port,()=> {
    console.log("Servidor corriendo en el puerto: ",port)
})

