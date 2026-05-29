require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log('Erro MySQL:', err);
        return;
    }

    console.log('MySQL conectado');
});

app.get('/player/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM player WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results[0]);
        }
    );
});

app.get('/player', (req, res) => {

    db.query(
        'SELECT * FROM player',
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
});

app.post('/player/insertPlayer', (req, res) => {

    const { nome } = req.body;

    db.query(
        'INSERT INTO player (nome) VALUES (?)',
        [nome],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: 'Player inserido com sucesso',
                insertId: results.insertId
            });
        }
    );
});

app.delete('/player/deletePlayer/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM player WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Player não encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Player deletado com sucesso'
            });
        }
    );
});

app.put('/player/updatePlayer/:id', (req, res) => {

    const { id } = req.params;
    const { nome } = req.body;

    db.query(
        'UPDATE player SET nome = ? WHERE id = ?',
        [nome, id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Player não encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Player atualizado com sucesso'
            });
        }
    );
});

app.listen(process.env.PORT, () => {
    console.log(`API rodando na porta ${process.env.PORT}`);
});
