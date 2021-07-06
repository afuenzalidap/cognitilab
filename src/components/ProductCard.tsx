import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, useWindowDimensions } from 'react-native';
import { formatNumber } from 'react-native-currency-input';

import { FadeInImage } from './FadeInImage';
import { useNavigation } from '@react-navigation/core';
import { Producto } from '../interfaces/appInterfaces';
import { Card, Title } from 'react-native-paper';
import BottomSheetBehavior from 'reanimated-bottom-sheet';
import { ProductosContext } from '../context/ProductosContext';

interface Props {
    product: Producto;
    bs: React.RefObject<BottomSheetBehavior>;
}

export const ProductCard = ({ product, bs }: Props) => {
    const sWidth = useWindowDimensions().width;
    const sHeight = useWindowDimensions().height;

    const { setId, setProduct } = useContext(ProductosContext);

    const navigation = useNavigation();

    const formattedValue = formatNumber(product.Precio, {
        separator: ',',
        precision: 0,
        delimiter: '.',
        ignoreNegative: true,
      });

    return (
        <View>
            <TouchableOpacity
                activeOpacity = { 0.7 }
                onLongPress = { () => {
                    bs.current!.snapTo(0);

                    setId( product.id );
                    setProduct( product );
                } }
                onPress = { () => navigation.navigate('ProductoScreen', {
                    simpleProduct: product
                }) }
            >
                <Card style = {{
                    ...styles.card,
                    width: (sWidth * 0.5) - 20
                }}>
                    {
                        ( product.Foto.length > 0 ) 
                        ? 
                        (   <FadeInImage 
                                uri = { product.Foto } 
                                style = {{
                                    ...styles.productImage,
                                    width: (sWidth * 0.5) - 30
                                }} 
                            /> )
                        :
                        (   <Image 
                                source = { require('../assets/Cognitilab.png') } 
                                style = {{
                                    ...styles.productImage,
                                    width: (sWidth * 0.5) - 30 
                                }} 
                            /> )
                    }
                    <Card.Content>
                        <Title 
                            style = {{ 
                                fontSize: 16,
                                height: 100 
                            }}>
                                { product.Producto }
                        </Title>
                        <Text 
                        style = {{ 
                            color: 'red', 
                            fontWeight: 'bold', 
                            fontSize: 25,
                        }}>$ 
                            { formattedValue }
                        </Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 0,
        backgroundColor: 'white',
        height: 300,
        marginBottom: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    productImage: {
        marginVertical: 10,
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        height: 140,
    }
});