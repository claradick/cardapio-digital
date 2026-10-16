import pool from '../database/conexao.js';

// Confere se todos os campos obrigatórios chegaram preenchidos
function dadosValidos(corpo) {
  const { nome, tipo, molho, preco, porcao, descricao, imagem } = corpo;
  return nome && tipo && molho && porcao && descricao && imagem && !isNaN(Number(preco));
}

// ---------- READ: lista todas as massas ----------
export async function listarMassas(req, res) {
  try {
    const [linhas] = await pool.query(
      'SELECT id, nome, tipo, molho, preco, imagem FROM massas'
    );
    res.json(linhas);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar as massas' });
  }
}

// ---------- READ: busca uma massa pelo id ----------
export async function buscarMassaPorId(req, res) {
  try {
    const [linhas] = await pool.query(
      'SELECT * FROM massas WHERE id = ?',
      [req.params.id]
    );
    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Massa não encontrada' });
    }
    res.json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar a massa' });
  }
}

// ---------- CREATE: cadastra uma nova massa ----------
export async function criarMassa(req, res) {
  if (!dadosValidos(req.body)) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }
  const { nome, tipo, molho, preco, porcao, descricao, imagem } = req.body;
  try {
    const [resultado] = await pool.query(
      'INSERT INTO massas (nome, tipo, molho, preco, porcao, descricao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, tipo, molho, preco, porcao, descricao, imagem]
    );
    res.status(201).json({ id: resultado.insertId, mensagem: 'Massa cadastrada' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar a massa' });
  }
}

// ---------- UPDATE: atualiza uma massa existente ----------
export async function atualizarMassa(req, res) {
  if (!dadosValidos(req.body)) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }
  const { nome, tipo, molho, preco, porcao, descricao, imagem } = req.body;
  try {
    const [resultado] = await pool.query(
      'UPDATE massas SET nome = ?, tipo = ?, molho = ?, preco = ?, porcao = ?, descricao = ?, imagem = ? WHERE id = ?',
      [nome, tipo, molho, preco, porcao, descricao, imagem, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Massa não encontrada' });
    }
    res.json({ mensagem: 'Massa atualizada' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar a massa' });
  }
}

// ---------- DELETE: exclui uma massa ----------
export async function excluirMassa(req, res) {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM massas WHERE id = ?',
      [req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Massa não encontrada' });
    }
    res.json({ mensagem: 'Massa excluída' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir a massa' });
  }
}