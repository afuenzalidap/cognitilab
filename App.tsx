import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ProductosNavigator } from './src/navigator/Navigator';
import { ProductosProvider } from './src/context/ProductosContext';

const AppState = ({ children }: any) => {
  return (
      <ProductosProvider>
          { children }
      </ProductosProvider>
  )
}

export const App = () => {
    return (
        <NavigationContainer>
          <AppState>
            <ProductosNavigator />
          </AppState>
        </NavigationContainer>
    )
}


 export default App;
