import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export const Loading = () => {
    return (
        <View style = { styles.activityContainer }>
                <ActivityIndicator
                    size = { 50 }
                    color = "grey"
                />

                <Text style = {{ fontSize: 28 }}>Cargando weas cognitivas</Text>

            </View>
    )
}

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
