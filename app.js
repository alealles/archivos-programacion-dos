const express = require('express');
const app = express();

// CONFIGURACIÓN CLAVE: Definir carpeta para archivos estáticos (CSS, imágenes)
app.use(express.static('.'));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Datos de prueba
const alumnos = [
    { nombre: 'Ana García', materia: 'Programación', nota: 9 },
    { nombre: 'Luis Torres', materia: 'Base de Datos', nota: 7 },
    { nombre: 'Sofía Pérez', materia: 'Programación', nota: 10 },
    { nombre: 'Carlos Ruiz', materia: 'Diseño Web', nota: 6 }
];

app.get('/', (req, res) => {
    const busqueda = req.query.buscar || '';
    
    const alumnosFiltrados = alumnos.filter(alumno => 
        alumno.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    res.render('index', { alumnos: alumnosFiltrados, busqueda });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));