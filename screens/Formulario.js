import { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { API_URL, cores } from '../config';

const vazio = { nome: '', tipo: '', molho: '', preco: '', porcao: '', descricao: '', imagem: '' };

const rotulos = {
  nome: 'Nome',
  tipo: 'Tipo',
  molho: 'Molho',
  preco: 'Preço',
  porcao: 'Porção',
  descricao: 'Descrição',
  imagem: 'Imagem',
};

export default function Formulario({ route, navigation }) {
  const id = route.params?.id;          // com id = EDITAR | sem id = CADASTRAR
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');          // mensagem de erro na tela
  const [salvando, setSalvando] = useState(false); // impede cadastrar duas vezes

  useEffect(() => {
    navigation.setOptions({ title: id ? 'Editar massa' : 'Nova massa' });

    if (id) {
      fetch(`${API_URL}/massas/${id}`)
        .then((resposta) => resposta.json())
        .then((dados) => setForm({ ...dados, preco: String(dados.preco) }))
        .catch(() => setErro('Não foi possível carregar os dados da massa.'));
    }
  }, [id]);

  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor });
    if (erro) setErro('');   // some com o aviso quando a pessoa volta a digitar
  }

  // Confere os campos antes de enviar e devolve a mensagem de erro (ou '' se estiver tudo certo)
  function validar() {
    for (const campo of Object.keys(rotulos)) {
      if (!String(form[campo]).trim()) {
        return `Preencha o campo "${rotulos[campo]}".`;
      }
    }
    const preco = Number(form.preco.replace(',', '.'));
    if (isNaN(preco) || preco <= 0) {
      return 'O preço precisa ser um número maior que zero (ex.: 48,90).';
    }
    return '';
  }

  async function salvar() {
    if (salvando) return;    // ignora toques repetidos

    const mensagem = validar();
    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setErro('');
    setSalvando(true);

    const corpo = {
      nome: form.nome.trim(),
      tipo: form.tipo.trim(),
      molho: form.molho.trim(),
      preco: form.preco.replace(',', '.'),
      porcao: form.porcao.trim(),
      descricao: form.descricao.trim(),
      imagem: form.imagem.trim(),
    };

    try {
      const resposta = await fetch(id ? `${API_URL}/massas/${id}` : `${API_URL}/massas`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      });

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.erro || `Erro ao salvar (código ${resposta.status}).`);
        setSalvando(false);
        return;
      }

      navigation.goBack();   // deu certo: volta para a tela anterior
    } catch (e) {
      setErro('Não foi possível conectar à API. Verifique se ela está ligada.');
      setSalvando(false);
    }
  }

  const campos = [
    ['nome', 'Nome', 'default'],
    ['tipo', 'Tipo (ex.: Massa longa)', 'default'],
    ['molho', 'Molho', 'default'],
    ['preco', 'Preço (ex.: 48,90)', 'decimal-pad'],
    ['porcao', 'Porção (ex.: 1 pessoa)', 'default'],
    ['imagem', 'Imagem (arquivo.jpg ou link https://)', 'default'],
  ];

  return (
    <ScrollView style={{ backgroundColor: cores.fundo }} contentContainerStyle={{ padding: 16 }}>
      {campos.map(([campo, placeholder, teclado]) => (
        <TextInput
          key={campo}
          style={styles.input}
          placeholder={placeholder}
          keyboardType={teclado}
          autoCapitalize={campo === 'imagem' ? 'none' : 'sentences'}
          value={form[campo]}
          onChangeText={(texto) => alterar(campo, texto)}
        />
      ))}

      <TextInput
        style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
        placeholder="Descrição"
        multiline
        value={form.descricao}
        onChangeText={(texto) => alterar('descricao', texto)}
      />

      {/* Aviso de erro dentro da tela */}
      {erro !== '' && (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.botao, salvando && { opacity: 0.6 }]}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : id ? 'Salvar alterações' : 'Cadastrar massa'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: cores.branco, borderWidth: 1, borderColor: cores.verde, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  caixaErro: { backgroundColor: '#FDECEC', borderWidth: 1, borderColor: cores.vermelho, borderRadius: 10, padding: 12, marginBottom: 12 },
  textoErro: { color: cores.vermelho, fontSize: 15, fontWeight: 'bold' },
  botao: { backgroundColor: cores.vermelho, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  botaoTexto: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },
});