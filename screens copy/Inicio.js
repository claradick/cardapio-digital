import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores } from '../config';

export default function Inicio({ navigation }) {
  return (
    <View style={styles.tela}>
      <View style={styles.faixaVerde} />

      <View style={styles.centro}>
        <Text style={styles.titulo}>Trattoria{'\n'}Bella Massa</Text>
        <Text style={styles.sub}>Massas artesanais, direto da Itália para a sua mesa.</Text>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Catalogo')}>
          <Text style={styles.botaoTexto}>Ver cardápio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.faixaVermelha} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco },
  faixaVerde: { height: 90, backgroundColor: cores.verde },
  faixaVermelha: { height: 90, backgroundColor: cores.vermelho },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 38, fontWeight: 'bold', color: cores.verde, textAlign: 'center' },
  sub: { fontSize: 16, color: cores.texto, textAlign: 'center', marginVertical: 20 },
  botao: { backgroundColor: cores.vermelho, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  botaoTexto: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },
});