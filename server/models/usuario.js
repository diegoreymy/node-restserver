// =================================================================================================
// En esta sección vamos establecer los modelos. En este caso comenzaremos con el modelo 'Usuario'
// y para eso usaremos la biblioteca 'mongoose' que nos ayudará a crear la estructura de datos 
// o esquema del usuario. También usaremos la biblioteca 'mongoose-unique-validator' para ayudarnos 
// con el manejo de errores para datos que deban ser únicos. Ya que simplifica esa tarea.
// =================================================================================================


const mongoose = require('mongoose'); //Traemos la funcionalidad del paquete mongoose
const uniqueValidator = require('mongoose-unique-validator'); // //Traemos la funcionalidad del paquete mongoose-unique-validator


let rolesValidos = { // Definimos un objeto con los roles permitidos en el esquema del usuario.
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};


let Schema = mongoose.Schema; // Creamos el objeto Schema de moongose.
let autoIncrement = require('mongoose-auto-increment'); // Usamos este plugin para crear un id con incremeto automatico

/*
Basicamente aqui vamos a definir la estructura del objeto 'Usuario' dentro de nuestra base de datos.
definiendo los campos y sus caracteristicas.
*/

let usuarioSchema = new Schema({ // Creamos una instancia del objeto Schema.
    first_name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    last_name: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    email: {
        type: String,
        unique: true, // El valor de este campo será unico en nuestra tabla.
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    avatar: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE', // Por defecto los roles serán 'USER_ROLE'.
        enum: rolesValidos // Usamos el objeto rolesValidos creado arriba.
    },
    // ===================================================================================
    // Un usuario que haya sido eliminado no será borrado completamente, en su lugar su
    // estado cambiara a false, y cuando se hagan solicitudes get, solo mostrará usuarios
    // con un estado true. 
    // ===================================================================================
    estado: {
        type: Boolean,
        default: true
    }
});

// =========================================================================================================
// En esta función devolvemos el Usuario sin la clave. Para mayor seguridad siempre vamos a eliminar la 
// clave del Usuario. Entonces Convertimos el usuario en un objeto, eliminamos el password y lo hacemos un 
// JSON de nuevo.
// =========================================================================================================
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// =============================================================================
// Usamos la biblioteca 'mongoose-unique-validator' para verificar 
// que los campos sean unicos y devolver un mensaje en caso que no lo sean
// =============================================================================
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
autoIncrement.initialize(mongoose.connection);
usuarioSchema.plugin(autoIncrement.plugin, 'Usuario'); // Usamos este plugin para crear un id con incremeto automatico

//Exportamos el esquema del usuario.
module.exports = mongoose.model('Usuario', usuarioSchema);