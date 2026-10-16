import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,                   // 3: confira a porta do seu MySQL
  user: 'root',
  password: 'admin',   // 2: a senha que você usa no Workbench
  database: 'cardapio',  // 4: nome do BANCO no MySQL (não é o nome da pasta)
});

function dadosValidos(c) {
  return c.nome && c.tipo && c.molho && c.porcao && c.descricao && c.imagem && !isNaN(Number(c.preco));
}

// Teste: mostra que esta versão (com CRUD) é a que está rodando
app.get('/versao', (req, res) => res.json({ versao: 'CRUD completo' }));

app.get('/massas', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT id, nome, tipo, molho, preco, imagem FROM massas');
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar as massas' });
  }
});

app.get('/massas/:id', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM massas WHERE id = ?', [req.params.id]);
    if (linhas.length === 0) return res.status(404).json({ erro: 'Massa não encontrada' });
    res.json(linhas[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar a massa' });
  }
});

app.post('/massas', async (req, res) => {
  if (!dadosValidos(req.body)) return res.status(400).json({ erro: 'Preencha todos os campos' });
  const { nome, tipo, molho, preco, porcao, descricao, imagem } = req.body;
  try {
    const [existe] = await pool.query(
      'SELECT id FROM massas WHERE LOWER(nome) = LOWER(?)',
      [nome]
    );
    if (existe.length > 0) {
      return res.status(409).json({ erro: 'Já existe uma massa com esse nome.' });
    }

    const [r] = await pool.query(
      'INSERT INTO massas (nome, tipo, molho, preco, porcao, descricao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, tipo, molho, preco, porcao, descricao, imagem]
    );
    res.status(201).json({ id: r.insertId, mensagem: 'Massa cadastrada' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar a massa' });
  }
});

app.put('/massas/:id', async (req, res) => {
  console.log('PUT recebido, id:', req.params.id);
  if (!dadosValidos(req.body)) return res.status(400).json({ erro: 'Preencha todos os campos' });
  const { nome, tipo, molho, preco, porcao, descricao, imagem } = req.body;
  try {
    const [r] = await pool.query(
      'UPDATE massas SET nome = ?, tipo = ?, molho = ?, preco = ?, porcao = ?, descricao = ?, imagem = ? WHERE id = ?',
      [nome, tipo, molho, preco, porcao, descricao, imagem, req.params.id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ erro: 'Massa não encontrada' });
    res.json({ mensagem: 'Massa atualizada' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar a massa' });
  }
});

app.delete('/massas/:id', async (req, res) => {
  console.log('DELETE recebido, id:', req.params.id);
  try {
    const [r] = await pool.query('DELETE FROM massas WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ erro: 'Massa não encontrada' });
    res.json({ mensagem: 'Massa excluída' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir a massa' });
  }
});

app.listen(3000, '0.0.0.0', () => console.log('API CRUD rodando na porta 3000'));