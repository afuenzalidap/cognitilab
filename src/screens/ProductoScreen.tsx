import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { View,  ScrollView, TextInput, StyleSheet, TouchableOpacity, Button, Image, Platform } from 'react-native';

import { Text, Snackbar } from 'react-native-paper';

import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import { useForm } from '../hooks/useForm';

import { RootStackParams } from '../navigator/Navigator';
import { ProductosContext } from '../context/ProductosContext';
import { FadeInImage } from '../components/FadeInImage';
import { Loading } from '../components/Loading';

interface Props extends StackScreenProps<RootStackParams, 'ProductoScreen'>{}

export const ProductoScreen = ({ route, navigation }: Props) => {
    const { simpleProduct } = route.params;

    const { addProduct, updateProduct, uploadImage, loadProductById, isUploading, deleteImage } = useContext(ProductosContext);

    const { _id, _producto,_descripcion,_precio, _foto, onChange, setFormValue, form } = useForm({
        _id: simpleProduct.id || '',
        _producto: simpleProduct.Producto || '',
        _descripcion: simpleProduct.Descripcion || '',
        _precio: simpleProduct.Precio || 0,
        _foto: simpleProduct.Foto || ''
    });

    const [visible, setVisible] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);


    useEffect(() => {
        navigation.setOptions(
            {
                headerShown: true,
                title: 'Producto'
            }
        );
    }, []);

    useEffect(() => {
        loadProducto();
    }, []);

    const takePhotoFromGallery = async() => {
        const img = await ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
          }).then(async(image) => {

            if(_foto.length > 0){
                await deleteImage(_foto);
            }

            const images = await Promise.all(image.map(async(img) =>  {
                const fullPath = await uploadImage( img.path );
                return fullPath
            }));

            setFormValue({
                ...form,
                _foto: (images.length > 0) ? images[0] : '',
            });
            
          })
          .catch(err => {
              console.log(err);
          })
    }

    const loadProducto = async() => {

        if( _id.length === 0 ) return;

        const producto = await loadProductById( _id );

        setFormValue({
            _id: producto.id,
            _producto: producto.Producto,
            _descripcion: producto.Descripcion,
            _precio: producto.Precio,
            _foto: producto.Foto || '',
        });
    }

    const saveOrUpdate = async() => {
        if( _id.length > 0 ){
            await updateProduct( _producto,_descripcion,_precio, _foto, _id );
        }else{
            const newProduct = await addProduct( _producto,_descripcion,_precio );
            onChange( newProduct.id, '_id');
        }

        onToggleSnackBar();
    }

    return (
        <View style = {{
                ...styles.container ,
                marginBottom: 10,
                backgroundColor: '#F7F7F7'
            }}>
            <ScrollView style = {{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'white'
            }}>
                <Text style = { styles.label }>Producto:</Text>
                
                <TextInput 
                    placeholder = "Producto"
                    style = { styles.textInput }
                    value = { _producto }
                    onChangeText = { (value) => {
                        onChange(value, '_producto');
                    }}
                    selectTextOnFocus = { true }
                    selectionColor = '#F5D21E'
                />
                
                <Text style = { styles.label }>Descripción:</Text>
                <TextInput 
                    placeholder = "Descripcion"
                    style = { styles.textInput }
                    value = { _descripcion }
                    onChangeText = { (value) => {
                        onChange(value,'_descripcion');
                    } }
                    selectTextOnFocus = { true }
                    selectionColor = '#F5D21E'
                />
                
                <Text style = { styles.label }>Precio:</Text>
                <TextInput 
                    placeholder = "Precio"
                    style = { styles.textInput }
                    value = { _precio.toString() }
                    keyboardType = 'number-pad'
                    onChangeText = { (value) => {
                        onChange(value,'_precio');
                    }}
                    selectTextOnFocus = { true }
                    selectionColor = '#F5D21E'
                />

                {
                    (isUploading) 
                    ? (
                        <Loading />
                    )
                    : (
                        
                            ( _id.length > 0 ) &&
                                (
                                    <>
                                        <TouchableOpacity
                                            onPress = { takePhotoFromGallery }
                                            activeOpacity = { 0.7 }
                                            style = { styles.card }
                                        >
                                        {
                                            (_foto.length > 0)
                                            ? ( <FadeInImage
                                                    uri = { _foto }
                                                    style = { styles.productImage }
                                                />)
                                            : (<Image
                                                    source = { require('../assets/Cognitilab.png') }
                                                    style = { styles.productImage }
                                                />)
                                        }
                                        </TouchableOpacity>
                                    </>
                                )
                        
                    )
                }

                <View>
                    <TouchableOpacity
                        style = { styles.commandButton }
                        onPress = { saveOrUpdate }
                    >
                        <Text style= {{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = { styles.commandButton }
                        onPress = { () => navigation.pop() }
                    >
                        <Text style= {{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Snackbar
                duration = { 1500 }
                theme = {{ colors: { accent: '#F5D21E' } }}
                style = {{
                    backgroundColor: 'white',
                    borderColor: '#F5D21E',
                    borderWidth: 2
                }}
                visible={ visible }
                onDismiss={ onDismissSnackBar }
                action={{
                    label: 'Cerrar',
                    labelStyle:{ color: 'black' },
                }}>
                <Text style = {{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Información agregada.</Text>
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    card: {
        backgroundColor: '#F5D21E',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        width: 200,
        height: 270,
        marginBottom: 25,
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
        width: 200,
        height: 270,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    textInputt: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 10
    },
    textDescripcion: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 80,
        marginTop: 5,
        marginBottom: 10
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#F5D21E',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 15
      },
      textInput: {
        flex:1,
        padding: 10,
        margin: 5,
        color: '#05375a',
        backgroundColor: 'white',
        fontSize: 17,
        borderRadius: 25,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1
      },
});