import React, { createContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import { Producto } from '../interfaces/appInterfaces';
import { Alert } from 'react-native';

type ProductosContextProps = {
    isUploading: boolean;
    products: Producto[];
    loadProducts: () => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    addProduct: ( productoName: string, descripcionName: string, precioValue: number ) => Promise<Producto>;
    updateProduct: (productoName: string, descripcionName: string, precioValue: number, fotoName: string, id: string) => Promise<void>;
    deleteProduct: (id: string) => void;
    uploadImage: (path: string ) => Promise<string>;
    deleteImage: (path: string ) => Promise<void>;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    product: Producto;
    setProduct: React.Dispatch<React.SetStateAction<Producto>>;
}

export const ProductosContext = createContext({} as ProductosContextProps);

export const ProductosProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState<Producto[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [id, setId] = useState('');
    const [product, setProduct] = useState<Producto>({
        id: '',
        Producto: '',
        Descripcion: '',
        Precio: 0,
        Foto: '',
        Disponible: true
    });

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
    }

    useEffect(() => {
        // Assume a message-notification contains a "type" property in the data payload of the screen to open
        messaging().onMessage( async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify( remoteMessage ));
        });
    
        messaging().onNotificationOpenedApp( async remoteMessage => {
            console.log('onNotificationOpenedApp', JSON.stringify( remoteMessage ));
        });
    
        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification,
              );
            }
          });
      }, []);

    useEffect(() => {
        loadProducts();

        /* firestore().settings({
            persistence: true,
        }) */
    }, []);

    useEffect(() => {
        requestUserPermission();
    }, [])

    const loadProducts = async() => {

        const productos = await firestore()
            .collection('productos')
            .orderBy('Producto', 'asc')
            .get()
            .then((value) => {
                
                return value.docs.map( (doc: any) => {
                    return {
                        id: doc.id,
                        Producto: doc.data().Producto,
                        Descripcion: doc.data().Descripcion,
                        Precio: doc.data().Precio,
                        Foto: doc.data().Foto,
                        Disponible: doc.data().Disponible
                    }
                });
            })

        setProducts([
            ...productos
        ]);
    }

    const loadProductById = async (id: string): Promise<Producto> => {
        const productos = await firestore()
            .collection('productos')
            .doc(id).get()
            .then(( value: any ) => {
                return {
                    id: id,
                    Producto: value.data().Producto,
                    Descripcion: value.data().Descripcion,
                    Precio: value.data().Precio,
                    Foto: value.data().Foto,
                    Disponible: value.data().Disponible
                }
            })
            .catch(err => {
                return {
                    id: '',
                    Producto: '',
                    Descripcion: '',
                    Precio: 0,
                    Foto: '',
                    Disponible: true
                }
            });

            return productos;
    }

    const addProduct = async (productoName: string, descripcionName: string, precioValue: number): Promise<Producto> => {
        const newProducto = await firestore().collection('productos')
        .add({
            Producto: productoName,
            Descripcion: descripcionName,
            Precio: precioValue,
            Foto: ''
        })
        .then(async (value) => {
            // Para agregar el id al objeto va un update aquí

            await updateProduct(productoName, descripcionName,precioValue,'', value.id);

            setProducts([
                ...products,
                {
                    id: value.id,
                    Producto: productoName,
                    Descripcion: descripcionName,
                    Precio: precioValue,
                    Foto: '',
                    Disponible: true
                }
            ]);

            return {
                id: value.id,
                Producto: productoName,
                Descripcion: descripcionName,
                Precio: precioValue,
                Foto: '',
                Disponible: true
            }
        });

        return newProducto
        
    }

    const updateProduct = async (productoName: string, descripcionName: string, precioValue: number, fotoName: string, id: string) => {

        const newProd = {
            id,
            Producto: productoName,
            Descripcion: descripcionName,
            Precio: precioValue,
            Foto: fotoName,
            Disponible: true
        }

        const resp = await firestore()
            .collection('productos')
            .doc(id)
            .update(newProd)
            .then(() => {

                setProducts( products.map( prod => {
                    return (prod.id === id )
                            ? newProd
                            : prod;
                }));
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteProduct = async (id: string) => {
        await firestore()
            .collection('productos')
            .doc(id)
            .delete()
            .then( async () => {
                setProducts( products.filter( prod => prod.id !== id) );
            })
            .catch(err => {
                console.log(err);
            })
    }

    const uploadImage = async (imagePath: any): Promise<string> => {
        setIsUploading(true);

        const filename= imagePath.substring(imagePath.lastIndexOf('/') + 1);

        const reference = storage().ref(filename);

        if( !filename ) return '';
        
        const resp = await reference.putFile( imagePath )
            .then( async (file) => {
                const url = await storage().ref(file.metadata.name).getDownloadURL();

                return url;
            })
            .catch( error => {
                console.log(error);
            })

        setIsUploading(false);
        return resp || '';
    }

    const deleteImage =  async(filename: string) => {
        if( filename === '') return;

        const storageRef = storage().refFromURL(filename);

        const imageRef = storage().ref(storageRef.fullPath);

        imageRef
        .delete()
        .then(()=> {
            console.log('Archivo eliminado');
        })
        .catch( e => {
            console.log('Error ', e);
        })



    }

    return (
        <ProductosContext.Provider value = {{
            isUploading,
            products,
            loadProducts,
            loadProductById,
            addProduct,
            updateProduct,
            deleteProduct,
            uploadImage,
            deleteImage,
            id,
            setId,
            product,
            setProduct
        }}>
            { children }
        </ProductosContext.Provider>
    )
}