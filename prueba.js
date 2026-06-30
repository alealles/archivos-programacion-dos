const express = require('express');
const aplicacion = express();
const puerto = 3000;

aplicacion.use(express.json);

let usuarios =[
{id:1, nombre:'Alejandro'},
{id:2, nombre:'Federico'}, 
{id:3, nombre:'Sofía'}
];

aplicacion.get('/usuarios', (req, res)=>{
    res.json(usuarios);
});

aplicacion.delete('/usuarios/:id', (req, res)=>{
        const idBuscado = parseInt(req.params.id);
        let mensaje = "";
        const index = usuarios.findIndex(usuario => usuario.id===idBuscado);

        if (index===-1){
            mensaje = 'Error. El usuario no ha sido encontrado en la base';
        }else{
             const usuarioBorrado = usuarios.splice(index, 1)[0];
            res.json({
            mensaje:'Usuario elminado',
            usuario: usuarioBorrado
            });
        }


       

        return mensaje; 
});




aplicacion.post('/usuarios', (req, res)=>{
    const edad = req.body.edad;
    const nombre = req.body.nombre;
    let resultado = "";

    if (!nombre){
        resultado = "el nombre es obligatorio";
    }else if (!edad){
        resultado = "La edad es obligatoria";
    }else{
        resultado = "Registro exitoso";
    }

    res.send(resultado);
});