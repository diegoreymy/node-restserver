// ==========================================================================================================
// En esta sección creamos el middelware para la ruta /login, para eso usaremos los siguientes paquetes:
// Express: para manejar la solicitud http,
// Bcryptjs: para comparar la contraseña ingresada por el usuario con la contraseña encriptada que 
// se encuentra en la base de datos, 
// Jwt: Para verificar el token que el usuario está usando en el header de la solicitud de login.
// ==========================================================================================================

const express = require('express'); //Traemos la funcionalidad del paquete express.
const bcrypt = require('bcryptjs'); //Traemos la funcionalidad del bcryptjs.
const jwt = require('jsonwebtoken'); //Traemos la funcionalidad del json web token.

const Usuario = require('../models/usuario'); //Traemos el esquema de usuario que exportamos en el modelo.

const app = express(); //Declaramos una instancia del objeto express.

app.post('/login', (req, res) => { //El login es una solicitud post donde recibimos los datos (req) y enviamos una respuesta (res)

    let body = req.body; // Obtenemos el body de la solicitud del usuario.

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { //Aqui buscamos un email en la base de datos que sea igual al recibido en el body con 'findOne'

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({ // error para cuando no exista el usuario.
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        // Usamos bcrypt para comprar la clave encriptada con la clave que recibimos en el body

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({ // error para cuando no exista la clave.
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        // Si todo va bien, hacemos el login y asignamos el tiempo de caducidad del token.

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });

});

module.exports = app; //Exportamos el objeto app.