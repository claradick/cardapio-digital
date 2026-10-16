-- Cria o banco (se ainda não existir) e entra nele
CREATE DATABASE IF NOT EXISTS cardapio_massas CHARACTER SET utf8mb4;
USE cardapio_massas;

-- Apaga a tabela antiga para poder recriar do zero
DROP TABLE IF EXISTS massas;

-- Cria a tabela de massas
CREATE TABLE massas (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- número único, gerado automaticamente
  nome VARCHAR(100) NOT NULL,          -- nome do prato
  tipo VARCHAR(50) NOT NULL,           -- massa longa, curta, recheada...
  molho VARCHAR(80) NOT NULL,          -- molho principal
  preco DECIMAL(6,2) NOT NULL,         -- preço com 2 casas decimais
  porcao VARCHAR(40) NOT NULL,         -- 1 pessoa, 1 a 2 pessoas...
  descricao TEXT NOT NULL,             -- descrição longa
  imagem VARCHAR(100) NOT NULL         -- nome do arquivo da foto
);

-- Insere as 8 massas
INSERT INTO massas (nome, tipo, molho, preco, porcao, descricao, imagem) VALUES
('Spaghetti alla Carbonara','Massa longa','Ovos, queijo pecorino e bacon',48.90,'1 pessoa','Clássico romano: spaghetti al dente envolvido em creme de gemas, pecorino e crocantes de bacon.','carbonara.jpg'),
('Fettuccine Alfredo','Massa longa','Creme de leite e parmesão',46.90,'1 pessoa','Fettuccine artesanal em molho cremoso de manteiga e parmesão, finalizado com pimenta-do-reino.','alfredo.jpg'),
('Lasanha à Bolonhesa','Massa de forno','Bolonhesa e bechamel',52.00,'1 a 2 pessoas','Camadas de massa fresca, ragu bolonhês, molho bechamel e muçarela gratinada.','lasanha.jpg'),
('Penne all''Arrabbiata','Massa curta','Tomate e pimenta calabresa',42.00,'1 pessoa','Penne em molho picante de tomate italiano, alho e pimenta, com toque de manjericão fresco.','arrabbiata.jpg'),
('Ravioli de Ricota e Espinafre','Massa recheada','Molho sugo e manjericão',54.90,'1 pessoa','Ravioli artesanal recheado com ricota e espinafre, servido com molho sugo e lascas de parmesão.','ravioli.jpg'),
('Gnocchi ao Sugo','Massa de batata','Tomate fresco',44.00,'1 pessoa','Nhoque macio de batata com molho de tomate fresco, manjericão e azeite extravirgem.','gnocchi.jpg'),
('Tagliatelle ao Pesto','Massa longa','Pesto de manjericão',47.50,'1 pessoa','Tagliatelle com pesto genovês de manjericão, pinoli e parmesão.','pesto.jpg'),
('Rigatoni Quattro Formaggi','Massa curta','Quatro queijos',50.00,'1 pessoa','Rigatoni em molho cremoso de muçarela, gorgonzola, parmesão e provolone.','quattro.jpg');