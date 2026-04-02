import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CallsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Calls Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CallsScreen;