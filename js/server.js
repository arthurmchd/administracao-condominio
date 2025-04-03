const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql2');
const cors = require('cors');
app.use(cors());

const PORT = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'trabalho3',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

app.get('/', (req, res) => {
  res.send('API de Cadastro de Moradores e Veículos');
});

app.get('/moradores', (req, res) => {
  const query = 'SELECT * FROM moradores';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

app.post('/moradores', (req, res) => {
  const { nome, bloco, apartamento, telefone, email, status } = req.body;

  const query = `
    INSERT INTO moradores (nome, bloco, apartamento, telefone, email, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [nome, bloco, apartamento, telefone, email, status],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  );
});

app.get('/veiculos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM veiculos WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    res.status(200).json(results[0]);
  });
});

app.get('/moradores/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM moradores WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Morador não encontrado' });
    }
    res.status(200).json(results[0]);
  });
});
app.put('/moradores/:id', (req, res) => {
  const { id } = req.params;
  const { nome, bloco, apartamento, telefone, email, status } = req.body;

  const query = `UPDATE moradores SET nome = ?, bloco = ?, apartamento = ?, telefone = ?, email = ?, status = ? WHERE id = ? `;

  connection.query(
    query,
    [nome, bloco, apartamento, telefone, email, status, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ id, ...req.body });
    }
  );
});

app.delete('/moradores/:id', (req, res) => {
  const { id } = req.params;

  const deleteVeiculosQuery = 'DELETE FROM veiculos WHERE morador_id = ?';

  connection.query(deleteVeiculosQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const deleteMoradorQuery = 'DELETE FROM moradores WHERE id = ?';
    connection.query(deleteMoradorQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Morador e veículos associados excluídos com sucesso!' });
    });
  });
});

app.get('/veiculos', (req, res) => {
  const query = 'SELECT * FROM veiculos';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

app.post('/veiculos', (req, res) => {
  const { placa, modelo, cor, morador_id, box } = req.body;

  const query = `
    INSERT INTO veiculos (placa, modelo, cor, morador_id, box)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [placa, modelo, cor, morador_id, box],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  );
});

app.put('/veiculos/:id', (req, res) => {
  const { id } = req.params;
  const { placa, modelo, cor, morador_id, box } = req.body;

  const query = `
    UPDATE veiculos
    SET placa = ?, modelo = ?, cor = ?, morador_id = ?, box = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [placa, modelo, cor, morador_id, box, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ id, ...req.body });
    }
  );
});

app.delete('/veiculos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM veiculos WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Veículo excluído com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});