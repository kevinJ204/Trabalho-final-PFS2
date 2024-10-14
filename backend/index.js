import express from 'express';
import process from 'process';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import RotaCandidato from './Rotas/RotaCandidato.js';
import RotaVaga from './Rotas/RotaVaga.js';
import RotaCandidatoVaga from './Rotas/RotaCandidatoVaga.js';

dotenv.config();

const host = 'localhost';
const porta = 4000;

const __dirname = path.resolve();
const key = fs.readFileSync(path.join(__dirname, 'certs', 'chave.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certs', 'certificado.crt'));

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'https://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 60 * 1000, 
        sameSite: 'none'
    }
}));

app.use(express.urlencoded({ extended: true }));

app.use('/candidatos', RotaCandidato);
app.use('/vagas', RotaVaga);
app.use('/inscricoes', RotaCandidatoVaga);

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

app.use(express.static(path.join(process.cwd(), 'build')));

const httpsOptions = {
    key: key,
    cert: cert
};

https.createServer(httpsOptions, app).listen(porta, host, () => {
    console.log(`Servidor escutando em https://${host}:${porta}`);
});
