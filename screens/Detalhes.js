import { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL, cores, urlImagem } from '../config';

// Mostra um aviso que funciona na web e no celular
function aviso(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export default function Detalhes({ route, navigation }) {
  const { id } = route.params;
  const [massa, setMassa] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useFocusEffect(
    useCallback(() => {
      fetch(`${API_URL}/massas/${id}`)
        .then((resposta) => resposta.json())
        .then((dados) => setMassa(dados))
        .catch(() => aviso('Erro', 'Não foi possível carregar a massa.'));
    }, [id])
  );

  // Chama o DELETE na API e volta para o catálogo
  async function excluir() {
    try {
      const resposta = await fetch(`${API_URL}/massas/${id}`, { method: 'DELETE' });
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        return aviso('Erro', erro.erro || `A API respondeu com erro ${resposta.status}`);
      }
      navigation.goBack();
    } catch (e) {
      aviso('Erro', 'Não foi possível conectar à API.');
    }
  }

  // Pede confirmação antes de excluir
  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja excluir "${massa.nome}"?`)) {
        excluir();
      }
    } else {
      Alert.alert('Excluir massa', `Deseja excluir "${massa.nome}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]);
    }
  }

  if (!massa) return <ActivityIndicator size="large" color={cores.verde} style={{ flex: 1 }} />;

  const total = (Number(massa.preco) * quantidade).toFixed(2).replace('.', ',');

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ScrollView>
        <Image source={{ uri: urlImagem(massa.imagem) }} style={styles.foto} />

        <View style={styles.corpo}>
          <Text style={styles.nome}>{massa.nome}</Text>
          <Text style={styles.descricao}>{massa.descricao}</Text>
          <Text style={styles.linha}><Text style={styles.rotulo}>Tipo: </Text>{massa.tipo}</Text>
          <Text style={styles.linha}><Text style={styles.rotulo}>Molho: </Text>{massa.molho}</Text>
          <Text style={styles.linha}><Text style={styles.rotulo}>Porção: </Text>{massa.porcao}</Text>

          <View style={styles.acoes}>
            <TouchableOpacity
              style={[styles.btnAcao, { backgroundColor: cores.verde }]}
              onPress={() => navigation.navigate('Formulario', { id: massa.id })}
            >
              <Text style={styles.btnAcaoTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAcao, { backgroundColor: cores.vermelho }]}
              onPress={confirmarExclusao}
            >
              <Text style={styles.btnAcaoTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.rodape}>
        <View style={styles.contador}>
          <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))}>
            <Text style={styles.sinal}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtd}>{quantidade}</Text>
          <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)}>
            <Text style={styles.sinal}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.botao}>
          <Text style={styles.botaoTexto}>R$ {total}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foto: { width: '100%', height: 280 },
  corpo: { padding: 18 },
  nome: { fontSize: 24, fontWeight: 'bold', color: cores.verde, marginBottom: 8 },
  descricao: { fontSize: 16, color: cores.texto, marginBottom: 14 },
  linha: { fontSize: 15, color: cores.texto, marginBottom: 4 },
  rotulo: { fontWeight: 'bold', color: cores.vermelho },
  acoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnAcao: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnAcaoTexto: { color: cores.branco, fontSize: 16, fontWeight: 'bold' },
  rodape: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: cores.branco, borderTopWidth: 3, borderTopColor: cores.vermelho },
  contador: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: cores.verde, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  sinal: { fontSize: 26, color: cores.verde, paddingHorizontal: 8 },
  qtd: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 },
  botao: { flex: 1, marginLeft: 14, backgroundColor: cores.verde, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  botaoTexto: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },
});