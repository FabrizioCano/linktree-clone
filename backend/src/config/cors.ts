import { white } from "colors";
import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
    //origin posee el dominio que intenta acceder a la API
    origin:function (origin, callback) {
        //definir un arreglo de dominios permitidos
        const whitelist = []
        whitelist.push(process.env.FRONTEND_URL);

        if(process.argv[2]=== '--api') {
            //si se ejecuta el servidor con el flag --api, significa que es una petición
            whitelist.push(undefined);
        }

        //si el origen es undefined, significa que la petición es local (por ejemplo, desde Postman o cURL)
        if(whitelist.includes(origin)) {
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    }
}