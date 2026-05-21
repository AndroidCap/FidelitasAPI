// server.js

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Chave secreta do JWT
const JWT_SECRET = 'cebolaroxa123';

// Dados do Usuário Mockado (com nome e saldo de pontos)
const usuarioMock = {
    id: 1,
    nome: 'Sandra Mathias',
    email: 'fidelitas@gmail.com',
    password: '123456',
    saldoPontos: 3250
};

// Banco temporário de promoções/destaques para o carrossel horizontal da Home
const promocoesMock = [
    {
        id: 1,
        titulo: 'Fim de Semana em Gramado',
        descricao: 'Resgate com 20% de desconto nesta semana!',
        pontos: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop'
    },
    {
        id: 2,
        titulo: 'Smartphone Top de Linha',
        descricao: 'O melhor da tecnologia na sua mão.',
        pontos: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop'
    },
    {
        id: 3,
        titulo: 'Voucher Café Gourmet',
        descricao: 'Comece seu dia com um café especial.',
        pontos: 300,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop'
    },
    {
        id: 4,
        titulo: 'Caixa de Som Bluetooth',
        descricao: 'Som de alta qualidade para as suas festas.',
        pontos: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop'
    },
    {
        id: 5,
        titulo: 'Fone de Ouvido Noise Cancelling',
        descricao: 'Foco total nas suas músicas e estudos.',
        pontos: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'
    },
    {
        id: 6,
        titulo: 'Smartwatch Esportivo',
        descricao: 'Monitore seus batimentos e atividades físicas.',
        pontos: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop'
    },
    {
        id: 7,
        titulo: 'Kit Chef de Cozinha',
        descricao: 'Facas profissionais para suas receitas.',
        pontos: 950,
        imageUrl: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&auto=format&fit=crop'
    },
    {
        id: 8,
        titulo: 'Mala de Viagem de Bordo',
        descricao: 'Mala rígida de alta durabilidade e rodinhas 360.',
        pontos: 1400,
        imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&auto=format&fit=crop'
    },
    {
        id: 9,
        titulo: 'Assinatura Streaming 6 meses',
        descricao: 'Assista a filmes e séries favoritos.',
        pontos: 600,
        imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop'
    },
    {
        id: 10,
        titulo: 'Kindle E-reader',
        descricao: 'Leve milhares de livros no seu bolso.',
        pontos: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop'
    }
];

//  lista de transações mockada próximo ao 'promocoesMock'
const transacoesMock = [
    { id: 1, descricao: 'Bônus de Cadastro', pontos: 500, isEntrada: true, dataOperacao: '10 Mai 2026' },
    { id: 2, descricao: 'Compra Loja Parceira Netshoes', pontos: 150, isEntrada: true, dataOperacao: '12 Mai 2026' },
    { id: 3, descricao: 'Resgate Voucher Starbucks', pontos: 300, isEntrada: false, dataOperacao: '14 Mai 2026' },
    { id: 4, descricao: 'Transferência Recebida de João', pontos: 200, isEntrada: true, dataOperacao: '15 Mai 2026' },
    { id: 5, descricao: 'Compra Supermercado Carrefour', pontos: 450, isEntrada: true, dataOperacao: '18 Mai 2026' }
];

// Endpoint de login (Idêntico ao seu anterior)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email !== usuarioMock.email || password !== usuarioMock.password) {
        return res.status(401).json({
            message: 'Usuário ou senha inválidos'
        });
    }

    const payload = {
        id: usuarioMock.id,
        nome: usuarioMock.nome,
        email: usuarioMock.email
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'
    });

    res.setHeader('Authorization', `Bearer ${token}`);

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

// Endpoint do Dashboard (Retorna o nome e o saldo de pontos do usuário logado)
app.get('/dashboard', autenticarToken, (req, res) => {
    return res.status(200).json({
        nome: usuarioMock.nome,
        saldoPontos: usuarioMock.saldoPontos
    });
});

// Endpoint das Promoções (Retorna os banners do carrossel da Home)
app.get('/promocoes', autenticarToken, (req, res) => {
    return res.status(200).json(promocoesMock);
});


app.get('/extrato', autenticarToken, (req, res) => {
    return res.status(200).json(transacoesMock);
});

// Helper para formatar a data atual no padrão "21 Mai 2026"
function formatarData(date) {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
}

// Endpoint para registrar um resgate de pontos
app.post('/resgatar', autenticarToken, (req, res) => {
    const { promocaoId, pontos, titulo } = req.body;

    if (!pontos || pontos <= 0) {
        return res.status(400).json({ message: 'Quantidade de pontos inválida.' });
    }

    if (usuarioMock.saldoPontos < pontos) {
        return res.status(400).json({ message: 'Saldo insuficiente para este resgate.' });
    }

    // Deduz os pontos do saldo do usuário
    usuarioMock.saldoPontos -= pontos;

    // Cria e registra a nova transação
    const novaTransacao = {
        id: transacoesMock.length + 1,
        descricao: `Resgate: ${titulo}`,
        pontos: pontos,
        isEntrada: false,
        dataOperacao: formatarData(new Date())
    };
    transacoesMock.push(novaTransacao);

    return res.status(200).json({
        novoSaldo: usuarioMock.saldoPontos,
        transacao: novaTransacao
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
