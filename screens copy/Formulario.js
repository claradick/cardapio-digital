import { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { API_URL, cores } from '../config';

const vazio = { nome: '', tipo: '', molho: '', preco: '', porcao: '', descricao: '', imagem: '' };

export default function Formulario({ route, navigation }) {
  const id = route.params?.id;   // com id = EDITAR | sem id = CADASTRAR
  const [form, setForm] = useState(vazio);

  useEffect(() => {
    navigation.setOptions({ title: id ? 'Editar massa' : 'Nova massa' });

    // No modo edição, busca os dados atuais para preencher os campos
    if (id) {
      fetch(`${API_URL}/massas/${id}`)
        .then((resposta) => resposta.json())
        .then((dados) => setForm({ ...dados, preco: String(dados.preco) }));
    }
  }, [id]);

  // Atualiza só o campo que mudou, mantendo os outros
  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function salvar() {
    // Troca vírgula por ponto (48,90 → 48.90) que é o formato do MySQL
    const corpo = { ...form, preco: form.preco.replace(',', '.') };

    fetch(id ? `${API_URL}/massas/${id}` : `${API_URL}/massas`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
      .then(async (resposta) => {
        if (!resposta.ok) {
          const erro = await resposta.json();
          return Alert.alert('Atenção', erro.erro);
        }
        navigation.goBack();
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível conectar à API.'));
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
      {campos.map(([campo, rotulo, teclado]) => (
        <TextInput
          key={campo}
          style={styles.input}
          placeholder={rotulo}
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

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.botaoTexto}>{id ? 'Salvar alterações' : 'Cadastrar massa'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: cores.branco, borderWidth: 1, borderColor: cores.verde, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  botao: { backgroundColor: cores.vermelho, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  botaoTexto: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },
});