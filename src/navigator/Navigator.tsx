import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductosScreen } from '../screens/ProductosScreen';
import { ProductoScreen } from '../screens/ProductoScreen';
import { Producto } from '../interfaces/appInterfaces';

export type RootStackParams = {
    ProductosScreen: undefined,
    ProductoScreen: { simpleProduct: Producto }
}

const Stack = createStackNavigator<RootStackParams>();

export const ProductosNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions = {{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            <Stack.Screen 
                name = "ProductosScreen" 
                component = { ProductosScreen } 
            />
            <Stack.Screen 
                name = "ProductoScreen" 
                component = { ProductoScreen }  
            />
        </Stack.Navigator>
    )
}
