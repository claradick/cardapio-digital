// ← Troque pelo IP do seu computador (ex.: 192.168.0.15)
export const API_URL = 'http://localhost:3000';

// Cores da bandeira da Itália
export const cores = {
  verde: '#008C45',
  vermelho: '#CD212A',
  branco: '#FFFFFF',
  fundo: '#F6F4EE',
  texto: '#2B2B2B',
};

// Aceita nome de arquivo (carbonara.jpg) ou link completo (https://...)
export function urlImagem(imagem) {
  return imagem.startsWith('http') ? imagem : `${API_URL}/imagens/${imagem}`;
}