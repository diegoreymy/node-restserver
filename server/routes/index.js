// ==================================================================
// En este archivo manejamos las diferentes rutas de la aplicación, 
// usaremos el paquete 'express' como base para facilitar la creación
// de la API. ( https://expressjs.com )
// ==================================================================

const express = require('express'); // //Traemos la funcionalidad del paquete express.

const app = express(); // Declaramos app como una instancia del objeto express.

app.use(require('./usuario')); //declaramos la ubicación del middelware para la ruta /usuarios.
app.use(require('./login')); //declaramos la ubicación del middelware para la ruta /login.
app.use(express.static('public'));



module.exports = app; //Exportamos el objeto app.