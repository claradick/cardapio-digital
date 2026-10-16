import { useState, useCallback } from 'react';
import { Text, Image, FlatList, View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL, cores, urlImagem } from '../config';

// Componente do card: recebe os dados por PROPS
function CardMassa({ item, aoClicar }) {
    return (
        <TouchableOpacity style={styles.card} onPress={aoClicar}>
            <Image source={{ uri: urlImagem(item.imagem) }} style={styles.foto} />
            <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.detalhe}>{item.tipo}</Text>
                <Text style={styles.detalhe}>{item.molho}</Text>
                <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2).replace('.', ',')}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function Catalogo({ navigation }) {
    const [massas, setMassas] = useState([]);       // lista vinda da API
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    // Roda sempre que a tela aparece (inclusive ao voltar do Formulário ou dos Detalhes)
    useFocusEffect(
        useCallback(() => {
            setErro(false);
            fetch(`${API_URL}/massas`)
                .then((resposta) => resposta.json())
                .then((dados) => setMassas(dados))
                .catch(() => setErro(true))
                .finally(() => setCarregando(false));
        }, [])
    );

    if (carregando) return <ActivityIndicator size="large" color={cores.verde} style={{ flex: 1 }} />;
    if (erro) return <Text style={styles.erro}>Não foi possível carregar o cardápio.</Text>;

    return (
        <View style={{ flex: 1, backgroundColor: cores.fundo }}>
            <FlatList
                contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
                data={massas}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <CardMassa
                        item={item}
                        aoClicar={() => navigation.navigate('Detalhes', { id: item.id })}
                    />
                )}
            />

            {/* Botão flutuante "+" para cadastrar */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Formulario')}>
                <Text style={styles.fabTexto}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: cores.branco, borderRadius: 14, marginBottom: 12, overflow: 'hidden', borderLeftWidth: 6, borderLeftColor: cores.vermelho, elevation: 3 },
    foto: { width: 110, height: 110 },
    info: { flex: 1, padding: 10, justifyContent: 'center' },
    nome: { fontSize: 16, fontWeight: 'bold', color: cores.verde },
    detalhe: { fontSize: 13, color: cores.texto },
    preco: { fontSize: 16, fontWeight: 'bold', color: cores.vermelho, marginTop: 4 },
    erro: { textAlign: 'center', marginTop: 40, color: cores.vermelho, fontSize: 16 },
    fab: { position: 'absolute', right: 20, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: cores.vermelho, alignItems: 'center', justifyContent: 'center', elevation: 6 },
    fabTexto: { color: cores.branco, fontSize: 34, marginTop: -2 },
});