import React, { useState, useLayoutEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const BLUE = "#007AFF";
const BLACK = "#000000";
const LENGTH = 6; // Length of the Room ID

export default function ChatA() {
    const navigation = useNavigation();
    const [roomID, setRoomId] = useState('');
    const {t} = useTranslation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Join a Chat',
            headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
            headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
    }, [navigation]);

    // Generating random room id for the initiating peer
    const generateID = () => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < LENGTH; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleSubmit = () => {
        if (roomID !== '') {
        	// Enter the room
            navigation.navigate('ChatB'as never, {roomID} as never);
        }
    }

    const handleCreateSubmit = () => {
    	// Make a new room ID
    	const room = generateID();
    	console.log('RoomIDUnirse: '+room); // Share this room id to another peer in order to join in the same room
    	setRoomId(room);
        console.log('La rom puesta es:  '+roomID)
        
        navigation.navigate('ChatB' as never, {roomID: room} as never);
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop:50
        },
        textInput: {
            height: 55,
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 18,
            backgroundColor: '#fff',
            borderWidth: .5,
        },
        inputContainer: {
            paddingLeft: 10,
            paddingRight: 10,
            margin: 10,
        },
        buttonContainer: {
            padding: 15,
        },
        textStyle: {
            alignSelf: 'center',
            color: '#D3D3D3',
            marginTop: 5,
        },
        errorStyle: {
            alignSelf: 'center',
            color: '#ff0000',
            marginBottom: 5,
            fontSize: 12,
        },
        backgroundImage: {
            flex: 1,
            resizeMode: 'cover',
          },
    });

    return (
        <ImageBackground source={require('../../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={{ alignSelf: 'center', fontSize: 24, margin: 8, fontWeight: 'bold' }}>P2P WEBRTC</Text>
                    <TextInput
                        placeholder="Room ID"
                        selectionColor="#DDD"
                        onChangeText={(text) => setRoomId(text)}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        color='#007AFF'
                        onPress={handleSubmit}
                        title="Join Room"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        color='#007AFF'
                        onPress={handleCreateSubmit}
                        title="Create Room"
                    />
                    <Text style={styles.textStyle}> {t("Don't have a Room ID? Create One")} :)</Text>
                </View>
            </View>
        </ImageBackground>
    )
}