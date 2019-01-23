// ============================================================================================
// En este archivo dejaremos las configuraciones generales de la aplicación,
// declaramos las variables globales para los diferentes ambientes (desarrollo y producción)
// y elementos esenciales como puerto, url de la base de datos, tiempo de caducidad del token y
// clave secreta para el jwt.
// ============================================================================================


// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000; // Si existe un puerto en el process enviroment usa ese, si no, usa el 3000.


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // Si estuviese en heroku por ejemplo el NODE_ENV sería 'production' si no entonces que sea 'dev'.


// ============================
//  Vencimiento del Token
// ============================
// 1000 Milisegundos
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30; // Este es el tiempo de caducidad del token almacenado en el process enviroment.


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; // El seed es una clave secreta para poder generar el token con jwt.

// ============================
//  Base de datos
// ============================
let urlDB;

// Si el ambiente es de desarrollo usará la base de datos local, si es de producción usa la base de datos de producción.

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/bd'; // Base de datos local.
} else {
    urlDB = process.env.MONGO_URI; // Base de datos de producción.
}
process.env.URLDB = urlDB; // Guarda la url de la base de datos en el Process Enviroment.