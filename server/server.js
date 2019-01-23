require('./config/config');

const express = require('express'); //Traemos la funcionalidad del paquete express.
const mongoose = require('mongoose'); //Traemos la funcionalidad del paquete mongoose

const bcrypt = require('bcryptjs'); //Traemos la funcionalidad del paquete bcryptjs.
const Usuario = require('./models/usuario'); //Traemos el esquema de usuario que exportamos en el modelo.


const app = express(); // Declaramos app como una instancia del objeto express.

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Configuración global de rutas
app.use(require('./routes/index'));


// Nos conectamos a la Base de Datos
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});

// Creamos un usuario administrar inicial para poder administrar la aplicación.
Usuario.count({ estado: true }, (err, conteo) => {

    if (conteo == 0) {
        let adminUser = new Usuario({
            first_name: 'Diego',
            last_name: 'Reymy',
            email: 'diegoreymy@gmail.com',
            password: bcrypt.hashSync('18637718', 10),
            role: 'ADMIN_ROLE',
            avatar: 'https://s.gravatar.com/avatar/2ddb45d841a8d860cda834cb232a8484?s=80'
        });

        adminUser.save(err => {
            if (err) {
                return "Error al guardar el Usuario Administrador."
            }
        });
    }

});

// Activamos la escucha al puerto seleccionado.
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});