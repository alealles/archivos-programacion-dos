const express = require('express');
const aplicacion = express();
const puerto = 3000;

aplicacion.set('view engine', 'ejs');
aplicacion.use(express.json()); 
aplicacion.use(express.urlencoded({ extended: true }));
aplicacion.use(express.static('public'));


let usuarios = [
    { id: 1, nombre: 'Alejandro', edad: 25 },
    { id: 2, nombre: 'Federico', edad: 30 }, 
    { id: 3, nombre: 'Sofía', edad: 22 }
];


function buscarUsuarioPorId(id) {
    const index = usuarios.findIndex(u => u.id===parseInt(id));
    let resultado = {index:-1, usuario:null};

    if (index!==-1){
        resultado = {index:index, usuario:usuarios.index};
    }

    return resultado; 
}

function generarSiguienteId() {
    let siguienteId = 1; 
    if (usuarios.length>0){
        siguienteId = usuarios[usuarios.length-1].id+1;

    }

    return siguienteId;
}



// 1. GET - Renderiza la vista EJS con la lista de usuarios
aplicacion.get('/usuarios', (req, res) => {
    res.render('usuarios', { listaUsuarios: usuarios });
});

// 2. GET - Obtener un usuario por ID (Devuelve JSON)
aplicacion.get('/usuarios/:id', (req, res) => {
    const busqueda = buscarUsuarioPorId(req.params.id);
    let codigoEstado = 200;
    let cuerpoRespuesta = {};

    if (busqueda.usuario === null) {
        codigoEstado = 404;
        cuerpoRespuesta = { error: 'El usuario no ha sido encontrado en la base' };
    } else {
        cuerpoRespuesta = busqueda.usuario;
    }
    res.status(codigoEstado).json(cuerpoRespuesta);
});

// 3. POST - Crear un nuevo usuario desde el formulario
aplicacion.post('/usuarios', (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;

    if (nombre && edad) {
        usuarios.push({
            id: generarSiguienteId(),
            nombre: nombre,
            edad: parseInt(edad)
        });
    }
    res.render('usuarios', { listaUsuarios: usuarios });
});

// 4. PUT - Actualizar un usuario existente (Para API)
aplicacion.put('/usuarios/:id', (req, res) => {
    const busqueda = buscarUsuarioPorId(req.params.id);
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    
    let codigoEstado = 200;
    let cuerpoRespuesta = {};

    if (busqueda.usuario === null) {
        codigoEstado = 404;
        cuerpoRespuesta = { error: 'El usuario no ha sido encontrado en la base' };
    } else {
        if (nombre) busqueda.usuario.nombre = nombre;
        if (edad) busqueda.usuario.edad = parseInt(edad);

        cuerpoRespuesta = {
            mensaje: 'Usuario actualizado con éxito',
            usuario: busqueda.usuario
        };
    }
    res.status(codigoEstado).json(cuerpoRespuesta);
});

// 5. DELETE alternativo por POST para que funcione el botón del HTML
aplicacion.post('/usuarios/eliminar/:id', (req, res) => {
    const busqueda = buscarUsuarioPorId(req.params.id);

    if (busqueda.index!==-1) {
        usuarios.splice(busqueda.index, 1);
    }
    res.render('usuarios', { listaUsuarios: usuarios });
});

// Inicialización del servidor
aplicacion.listen(puerto, () => {
    console.log(`Servidor corriendo en: http://localhost:${puerto}/usuarios`);
});