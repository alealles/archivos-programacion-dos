//Instalación de dependencias: npm install express express-session

const express = require('express');
const session = require('express-session');
const app = express();

// 1. MIDDLEWARES GLOBALES

app.use(express.json()); // Parser para JSON en peticiones

app.use(session({        // Configuración de SESIONES
  secret: 'mi_clave_secreta', //firma digital - ID sesión 
  resave: false, // no vuelve a guardar en memoria los datos de una sesión en curso 
  saveUninitialized: false, // no se le brinda datos a un usuario anónimo (petición)
  cookie: { maxAge: 60000 } // La sesión expira en 60 segundos
})); 

//SIMULACIÓN CONSULTA ASINCRÓNICA A LA BD

const buscarUsuarioenBase = async(username) =>{
  await new Promise(resolve=>setTimeout(resolve, 500))
  let usuario = null;
  if (username=='admin'){
      usuario = {username:'admin', pass:'1234', rol:'docente'}
  }
  return usuario; 
};


//MIDDLEWARE DE AUTENTICACION DE LA SESIÓN 

const verificarSesion = (req, res, next)=>{
  if (!req.session || !req.session.usuario){
      res.status(401).json({error:'Acceso denegado: Se debe iniciar sesión'})
  }else{
      next();
  }
  
}

//RUTA DEL LOGIN 

app.post('/login', async(req, res)=>{
  const{username, pass} = req.body;

  const usuarioBD = await buscarUsuarioenBase(username);

  let estado = 401; 
  let respuesta = {error: 'Credenciales no válidas'};

  if (usuarioBD && usuarioBD.pass === pass){
    req.session.usuario={
        username : usuarioBD.username,
        rol: usuarioBD.rol
    };

    estado = 200; 
    respuesta = {mensaje: 'Inicio de sesión exitoso'};
  }

  return res.status(estado).json(respuesta);

  

});

//RUTA PROTEGIDA

app.get('/dashboard', verificarSesion, (req, res)=>{
  res.json({
    mensaje: `Bienvenido al panel ${req.session.usuario.username}`,
    rol: req.session.usuario.rol,
    contenidos: 'Datos de la asignatura'
  });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));



