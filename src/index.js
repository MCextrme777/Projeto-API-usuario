const express = require('express');
const cors = require('cost');
const bcrypt = require('bcrypt'); // serve para criptografar a senha no BD
const db = require('../db/database');

const app = express();
app.use(cors()); // Libera acesso de outras origens
app.use(express.json()); //Permite receber JSON no body das requisições

const PORT = 3000
const SALT_ROUNDS = 10;

app.post("/api/users", async (req, res) => {
    try{
        const [ nome, email, senha ] = req.body;

        //Validação dos campos obrigatorios
        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: "Tem parada errada ai mano"
            });
        }

        const emailLowerCase = email.toloweCase();

        // Verificar se o email já está em uso
        const [rows] = await db.query("SELECT id FROM usuarios WHERE email = ?",
        [emailLowerCase]);

        if (rows.length > 0){
            return res.status(409).
            json({error: "Email á cadastrado."});
        }

        //Criptografia da senha
        const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);

        //Inserir um novo usuário no BD
        const [result] = await db.query(
            "INSERT INTO usuarios (nome, email, paswordHash) VALUES (?, ?, ?)",
            [nome, emailLowerCase, passwordHash]
        );

        const id = resurlt.insertId;

        res.status(201).json({
            id,
            nome,
            email: emailLowerCase
        });

    } catch (error) {
    console.error("Erro ao criar o usuário.", erro);
    res.status(500).json({
        error: "Erro interno ao criar usuário."});
    }    
})


//Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Deu certo meu nobre ${PORT}`);
});