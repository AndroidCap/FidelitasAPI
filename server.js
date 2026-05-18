// server.js

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Chave secreta do JWT
const JWT_SECRET = 'cebolaroxa123';

// Usuário mockado
const usuarioMock = {
    id: 1,
    username: 'fidelitas@gmail.com',
    password: '123456'
};

// Endpoint de login
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    // Validação simples
    if (
        username !== usuarioMock.username ||
        password !== usuarioMock.password
    ) {
        return res.status(401).json({
            message: 'Usuário ou senha inválidos'
        });
    }

    // Payload do token
    const payload = {
        id: usuarioMock.id,
        username: usuarioMock.username
    };

    // Geração do JWT
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'
    });

    // Retorna token no HEADER
    res.setHeader('Authorization', `Bearer ${token}`);

    // Retorna também no body
    return res.status(200).json({
        message: 'Login realizado com sucesso',
        token
    });
});

// Middleware para validar JWT
function autenticarToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não informado'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(403).json({
                message: 'Token inválido'
            });
        }

        req.usuario = decoded;

        next();
    });
}

// Endpoint protegido
app.get('/perfil', autenticarToken, (req, res) => {

    return res.status(200).json({
        message: 'Acesso autorizado',
        usuario: req.usuario
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});