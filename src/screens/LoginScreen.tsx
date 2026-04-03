import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    StyleSheet,
    StatusBar,
} from 'react-native';
import Logo from '../assets/logo.svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
    onLoginSuccess: () => void;
};

const LoginScreen = ({ onLoginSuccess }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        onLoginSuccess();
    };
    
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <View style={styles.logoContainer}>
                    <Logo width={120} height={120} />
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize='none'
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <FontAwesome
                                name={showPassword ? 'eye-slash' : 'eye'}
                                size={18}
                                color='#F57C00'
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.watermark}>bydaneca</Text>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1F1E',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    formContainer: {
        gap: 16,
    },
    input: {
        backgroundColor: '#1A2E2D',
        borderWidth: 1,
        borderColor: '#2F7F79',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontFamily: 'SpaceMono-Regular',
        fontSize: 14,
    },
    passwordContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A2E2D',
        borderWidth: 1,
        borderColor: '#2F7F79',
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontFamily: 'SpaceMono-Regular',
        fontSize: 14,
        backgroundColor: 'transparent'
    },
    loginButton: {
        backgroundColor: '#F57C00',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontFamily: 'SpaceMono-Bold',
        fontSize: 16,
        letterSpacing: 1, 
    },
    watermark: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        color: '#2F7F79',
        fontFamily: 'SpaceMono-Regular',
        fontSize: 11,
        opacity: 0.5,
    },
});

export default LoginScreen;