require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Configuración global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});
Usuario.count({ estado: true }, (err, conteo) => {

    if (conteo == 0) {
        let adminUser = new Usuario({
            nombre: 'admin',
            email: 'diegoreymy@gmail.com',
            password: bcrypt.hashSync('18637718', 10),
            role: 'ADMIN_ROLE'
        });

        adminUser.save(err => {
            if (err) {
                return "Error al guardar el Usuario Administrador."
            }
        });
    }

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
    console.log(process.env);//procesos
});