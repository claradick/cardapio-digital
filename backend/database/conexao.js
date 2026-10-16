import mysql from 'mysql2/promise';

// Pool = conjunto de conexões reaproveitadas (mais eficiente que abrir uma por consulta)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',   // ← troque pela senha do seu MySQL
  database: 'cardapio',
  port: '3307'
});

export default pool;