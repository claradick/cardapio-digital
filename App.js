import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inicio from './screens/Inicio';
import Catalogo from './screens/Catalogo';
import Detalhes from './screens/Detalhes';
import Formulario from './screens/Formulario';
import { cores } from './config';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: { backgroundColor: cores.verde },
          headerTintColor: cores.branco,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
        <Stack.Screen name="Catalogo" component={Catalogo} options={{ title: 'Cardápio' }} />
        <Stack.Screen name="Detalhes" component={Detalhes} options={{ title: 'Detalhes' }} />
        <Stack.Screen name="Formulario" component={Formulario} options={{ title: 'Massa' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}