// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';

const App = () => {
  const [recording, setRecording] = useState(null);
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    const getPermissions = async () => {
      await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    };
    getPermissions();
  }, []);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    // TODO: Implement speech-to-text, translation, and text-to-speech
    const transcribedText = await speechToText(uri);
    const translation = await translateText(transcribedText, 'en', 'es');
    setTranslatedText(translation);
    Speech.speak(translation, { language: 'es' });
  };

  const speechToText = async (uri: any) => {
    // Implement speech-to-text API call
    return "transcribed text";
  };

  const translateText = async (text: string, sourceLang: string, targetLang: string) => {
    // Implement translation API call
    return "translated text";
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Translated Text"
        value={translatedText}
        editable={false}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    height: 100,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 20,
  },
});

export default App;
