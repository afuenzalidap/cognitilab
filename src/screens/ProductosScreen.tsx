import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useRef, useState, useMemo, useCallback, createRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Image } from 'react-native';
import { Card, FAB, List, Paragraph, Title } from 'react-native-paper';

import { styles } from '../theme/appTheme';
import { RootStackParams } from '../navigator/Navigator';
import { ProductosContext } from '../context/ProductosContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loading } from '../components/Loading';
import { ProductCard } from '../components/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import BottomSheetBehavior from 'reanimated-bottom-sheet';

interface Props extends StackScreenProps<RootStackParams, 'ProductosScreen'>{}

export const ProductosScreen = ({ navigation }: Props) => {
    const { top } = useSafeAreaInsets();
    const sWidth = useWindowDimensions().width;
    const sHeight = useWindowDimensions().height;


    const { id, product } = useContext(ProductosContext);

    const bs = React.createRef<BottomSheetBehavior>();
    
    const fall = new Animated.Value(1);

    const { products, loadProducts, deleteProduct, deleteImage } = useContext(ProductosContext);
    const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);

    const loadProductsFromBackend = async () => {        
        setIsLoadingRefresh(true);
        await loadProducts();
        setIsLoadingRefresh(false);
    }

    const renderInner = () => (
        <View style={styleFab.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={styleFab.panelTitle}>Eliminar</Text>
            <Text style={styleFab.panelSubtitle}>¿Desea eliminar el item seleccionado?</Text>
          </View>
          <TouchableOpacity style={styleFab.panelButton} onPress={ eliminarItem }>
            <Text style={styleFab.panelButtonTitle}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styleFab.panelButton}
            onPress={() => bs.current!.snapTo(1)}>
            <Text style={styleFab.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )
    
      const renderHeader = () => (
        <View style={styleFab.header}>
          <View style={styleFab.panelHeader}>
            <View style={styleFab.panelHandle} />
          </View>
        </View>
      )

      const eliminarItem = () => {
          
          deleteProduct(id);

          eliminarImagen();

          bs.current!.snapTo(1)
      }

      const eliminarImagen = () => {

            deleteImage( product.Foto );
      }


    return (
        <View style = {{
            flex: 1,
            backgroundColor: '#F7F7F7'
        }}>
            <View style={{
                ...styleFab.headerContainer,
                backgroundColor: '#F5D21E'
            }}>
                <Image 
                    source = { require('../assets/Cognitilab.png') } 
                    style = {{
                        position: 'absolute',
                        width: 300,
                        height: 300,
                        top: 30,
                        right: 50,
                    }}
                />
            </View>
            <BottomSheet
                ref = { bs }
                snapPoints = { [260, 0] }
                renderContent = { renderInner }
                renderHeader = { renderHeader }
                initialSnap = { 1 }
                callbackNode = { fall }
                enabledGestureInteraction = { true }
            />
            {
                ( isLoadingRefresh )
                ? (
                    <Loading />
                )
                : (
                    <View
                        style = {{
                            alignItems: 'center'
                        }}
                    >
                        <FlatList
                            data = { products }
                            keyExtractor = { ( p ) => p.id }
                            showsVerticalScrollIndicator = { false }
                            numColumns = { 2 }
                            ListHeaderComponent = {(
                                <Text style = {{
                                    ...styles.title,
                                    ...styles.globalMargin,
                                    marginVertical: 50
                                }}>
                                    Catálogo
                                </Text>
                            )}
                            renderItem = { ({ item }) => (
                                <ProductCard product = { item } bs = { bs } />
                            )}
                            refreshing = { isLoadingRefresh }
                            onRefresh = {() => loadProductsFromBackend() }
                        />
                    </View>
                )
            }

            <FAB
                style={ styleFab.fab }
                icon = { () => <Icon 
                                    name="add-outline" 
                                    size = { 25 } 
                                    color = 'black'
                                /> 
                }
                onPress={() =>  navigation.navigate('ProductoScreen',{
                        simpleProduct: {
                            id: '',
                            Producto: '',
                            Descripcion: '',
                            Precio: 0,
                            Foto: '',
                            Disponible: true
                        }
                    }) 
                }
            />
        </View>
    )
}

const styleFab = StyleSheet.create({
    fab: {
        backgroundColor: '#F5D21E',
        position: 'absolute',
        margin: 15,
        right: 0,
        bottom: 0
    },
    headerContainer: {
        position: 'absolute',
        width: 300,
        height: 300,
        top: -100,
        right: -100,
        opacity: 0.5,
        zIndex: -999,
        borderBottomLeftRadius: 1000,
        borderBottomRightRadius: 1000
    },
    container: {
        flex: 1,
      },
      commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
      },
      panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
      },
      header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      panelHeader: {
        alignItems: 'center',
      },
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
      },
      panelTitle: {
        fontSize: 27,
        height: 35,
      },
      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },
      panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
      },
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
      action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
      },
      actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
      },
      textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
      },
  })