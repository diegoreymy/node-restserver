// =================================================================================================
// En este archivo se van a crear los "middlewares",
// es bueno entender un poco en que consisten los middlewares,
// para eso, voy a dejar el link con algunas informaciones 
// https://medium.com/@selvaganesh93/how-node-js-middleware-works-d8e02a936113
// Pero para resumir, aqui vamos a tener las funciones que van a actuar en la comunicación
// entre el cliente y nuestra aplicación. Como por ejemplo, verificar el token y el rol del usuario
// cada vez que se haga una solicitud http.   
// ==================================================================================================

const jwt = require('jsonwebtoken'); // Llama el paquete Json Web Token. 

// =================================================================================================
// pero, qué es JWT?
// Creo que la introducción oficial (https://jwt.io/introduction/) 
// de JWT es el recurso más útil para ello.
// =================================================================================================


// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {

    let token = req.get('token'); // Obtenemos el token desde el header (req.get) de la petición.

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        // =================================================================================================
        // SEED es una clave privada que es necesaría para decodificar el token,
        // con ella se comprueba si el token es válido o no. process.env.SEED, significa que esa clave
        // está almacenada como una variable global en el Process Enviroment de Node.
        // https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7 
        // =================================================================================================

        if (err) { // Si existe error devuelve un error 401 con un mensaje dentro de un objeto JSON.
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario; // Si no existe error, el seed coincide y el token es válido, entonces, decodifica el token.
        next(); // El middleware termina su función y da paso para que los datos vayan a la aplicación.

    });



};

// =========================================================================
// Verificar el rol del usuario es más simple ya que no usaremos el jwt.
// =========================================================================

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario; // Obtenemos todos los datos del usuario desde el body de la solicitud.

    if (usuario.role === 'ADMIN_ROLE') { // Comprobamos que el campo role sea "Admin".
        next(); // Si es verdadero continúa hacia la aplicación.
    } else {

        return res.json({ // Si no es Admin, envía una respuesta JSON de con el error.
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};



module.exports = { // Exportamos los middlewares para que puedan ser usados en otras funciones más adelante.
    verificaToken,
    verificaAdmin_Role
}