import express from 'express';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { validarRegistro, usuarios, verificarSesion } from './auth.js';

const app = express();
const PORT = 3000;

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Indicar a Express que sirva de forma automática los archivos de la carpeta 'public'
app.use(express.static('public'));

/* Middleware - para recoger datos de formulario */
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'cambia-esto-por-una-cadena-larga-y-secreta',
    resave: false,
    saveUninitialized: false
}));

/* Rutas - GET */

app.get('/', (req,res)=>{
    res.redirect('/login');
})

app.get('/dashboard', verificarSesion, (req, res) => {
    res.render('dashboard');
});

app.get('/login', (req,res)=>{
    res.render('login');
})


app.get('/registro', (req,res)=>{
    res.render('registro');
})

/* Rutas - POST */

app.post('/registro',  async (req, res) => {
    const nombre = req.body.nombre;
    const correo = req.body.email;
    const password = req.body.password;
    const confirmarPassword = req.body.confirmarPassword;

    const esValido = validarRegistro(
        nombre,
        correo,
        password ,
        confirmarPassword
    );

    if (!esValido) {
        return res.status(400).render('registro', {
            error: 'Comprueba los datos introducidos.'
        });
    }
    const emailExiste = usuarios.some(
        usuario => usuario.email === correo.trim().toLowerCase()
    );    console.log('Resultado:', emailExiste);
    console.log('Correo recibido:', correo);
    console.log('Array:', usuarios);


    if (emailExiste) {
        return res.status(400).render('registro', {
            error: 'Este correo electrónico ya está registrado.'
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre: nombre.trim(),
        email: correo.trim().toLowerCase(),
        password: passwordHash
    };

    usuarios.push(nuevoUsuario);

    res.redirect('/login');
});


app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const usuario = usuarios.find(
        usuario => usuario.email === email.trim().toLowerCase()
    );

    // Primero comprobamos si existe el usuario
    if (!usuario) {
        return res.status(401).render('login', {
            error: 'Correo o contraseña incorrectos.'
        });
    }

    // Después comprobamos la contraseña
    const contraseñaCorrecta = await bcrypt.compare(
        password,
        usuario.password
    );

    if (!contraseñaCorrecta) {
        return res.status(401).render('login', {
            error: 'Correo o contraseña incorrectos.'
        });
    }

    req.session.usuarioId = usuario.id;
    req.session.nombre = usuario.nombre;

    res.redirect('/dashboard');
});

app.post('/saldo', verificarSesion, async (req, res) => {
    const saldo = req.body.saldo;
});

/* Rutas no encontradas - 404 */
app.use((req, res) => {
    res.status(404).render('404');
})

// Iniciar el servidor Express
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});