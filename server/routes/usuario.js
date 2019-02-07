// ==========================================================================================================
// En esta sección creamos el middelware para la ruta /usuario, para eso usaremos los siguientes paquetes:
// Express: para manejar la solicitud http,
// Bcryptjs: para encriptar la contraseña ingresada por el usuario. 
// Underscore: porque nos proporciona utilidades que nos facilitan la vida, en este caso usaremos 'pick'
// que sirve para obtener un objeto con características específicas
// ==========================================================================================================

const express = require('express'); //Traemos la funcionalidad del paquete express.
const bcrypt = require('bcryptjs'); //Traemos la funcionalidad del paquete bcryptjs.
const _ = require('underscore'); //Traemos la funcionalidad del paquete underscore.

const Usuario = require('../models/usuario'); //Traemos el esquema de usuario que exportamos en el modelo.
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion'); //Traemos los middelwares de autenticación.

const app = express(); // Declaramos app como una instancia del objeto express.

// ==================================================================================================================
// A continuación vamos a construir los metodos para las solicitudes http get, post, put y delete.
// En todas usamos la ruta, el middlware verificaToken que importamos, la solicitud (req) y damos una respuesta (res)
// Y en el post, put y delete usamos el middleware verificaAdmin_Role para hacer que solo el Admin tenga acceso. 
// ==================================================================================================================

app.get('/usuario', verificaToken, (req, res) => {

    // ========================================================================================
    // Esto es opcional: si se quiere, se pasará como parametros en la url un inicio y
    // la cantidad de usuarios a retornar por ejemplo, https://url/usuario?desde=0&cantidad=7
    // si no se coloca nada llegarán por defecto solo 5 registros.
    // ========================================================================================

    let estado = req.query.estado || 'true';

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let cantidad = req.query.cantidad || 5;
    cantidad = Number(cantidad);

    if(estado == 'true'){

        Usuario.find({ estado: true }, 'first_name last_name email role estado avatar') // Buscamos registros con estado 'true' y traemos los campos especificados.
            .skip(desde) // Saltamos con 'skip' la cantidad de registros que vienen en el parámetro 'desde'.
            .limit(cantidad) // Traemos con 'limit' la cantidad de registros que coloquemos en el parámetro 'cantidad'.
            .exec((err, usuarios) => { // ejecutamos la función 'find' con las condiciones que pasamos.

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({ estado: true }, (err, cantidad) => { // Contamos la cantidad de registros 
                    res.json({ // Retornamos el json con los registros dentro de las condiciones y la cantidad de registros.
                        ok: true,
                        data: usuarios,
                        cantidad
                    });
                });
            });
    }
    if(estado == 'false'){
        Usuario.find({ estado: false }, 'first_name last_name email role estado avatar') // Buscamos registros con estado 'false' y traemos los campos especificados.
            .skip(desde) // Saltamos con 'skip' la cantidad de registros que vienen en el parámetro 'desde'.
            .limit(cantidad) // Traemos con 'limit' la cantidad de registros que coloquemos en el parámetro 'cantidad'.
            .exec((err, usuarios) => { // ejecutamos la función 'find' con las condiciones que pasamos.

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({ estado: false }, (err, cantidad) => { // Contamos la cantidad de registros 
                    res.json({ // Retornamos el json con los registros dentro de las condiciones y la cantidad de registros.
                        ok: true,
                        data: usuarios,
                        cantidad
                    });
                });
            });
    }

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body; // Tomamos el body de la solicitud y lo guardamos en 'body'

    let usuario = new Usuario({ // Creamos una instancia de usuario con los datos del body
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // Encriptamos el password del usuario
        role: body.role,
        avatar: body.avatar
    });


    usuario.save((err, usuarioDB) => { // Guardamos el usuario

        if (err) { // Si hay error retornamos un json con el error
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({ // Si no hay error retornamos el usuario que se guardó
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id; // Obtenemos el id pasado como parámetro
    let body = _.pick(req.body, ['first_name', 'last_name', 'password', 'email', 'avatar', 'role', 'estado']); // Solo tomamos elementos específicos del body
    if(body.password){
        body.password = bcrypt.hashSync(body.password, 10); // Encriptamos la contraseña que se actualizará (si existe).
    }
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

// Aqui en el delete no borraremos el registro, solo vamos a cambiarle su estado a false.

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {


    let id = req.params.id;

    // ============================================================================================
    // Si quisieramos que se elimine el registro en vez de cambiar de estado sería solo usar
    // la siguiente línea con el método 'findByIdAndRemove' en vez de 'findByIdAndUpdate':
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    // ============================================================================================

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});



module.exports = app;