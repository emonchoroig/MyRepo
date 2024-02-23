import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, Pressable, Platform } from "react-native";
import { ImageBackground } from "react-native";
import { SessionService } from "../../services/user/session.service";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}


const SettingsPage = () => {
  const [audioDescriptionEnabled, setAudioDescriptionEnabled] = useState(false);
  const navigation = useNavigation();
  const {t, i18n } = useTranslation();
  const [fontsLoaded, setFontsLoaded] = useState(false);


  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  //const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);

  useEffect(() => {
    const getSessionInfo = async () => {
        const isAudioDescription = await SessionService.getAudioDescription();
        if (isAudioDescription === "si") {
        setAudioDescriptionEnabled(true);
        } else if (isAudioDescription === "no") {
        setAudioDescriptionEnabled(false);
        }

        /*
        const isVoiceControlEnabled = await SessionService.getVoiceControl();
        if (isVoiceControlEnabled === "si") {
        setVoiceControlEnabled(true);
        } else if (isVoiceControlEnabled === "no") {
        setVoiceControlEnabled(false);
        }
        */
    }
    getSessionInfo();
    
  }, []);

  const LanguageSelector = () => {
    
    const [currentLanguage, setLanguage] = useState(i18n.language);

    const changeLanguage = (language:string) => {
      i18n.changeLanguage(language).then(() => setLanguage(language));
    };

    return (
      <View style={styles.container}>
        <Pressable onPress={() => changeLanguage('en')}>
          <Text style={styles.text_type_1}>{t("English")}</Text>
        </Pressable>
        <Pressable onPress={() => changeLanguage('es')}>
          <Text style={styles.text_type_1}>{t("Spanish")}</Text>
        </Pressable>
        <Pressable onPress={() => changeLanguage('de')}>
          <Text style={styles.text_type_1}>{t("German")}</Text>
        </Pressable>
        <Pressable onPress={() => changeLanguage('pt')}>
          <Text style={styles.text_type_1}>{t("Portuguese")}</Text>
        </Pressable>
      </View>
    );
  };


  const handleToggleAudioDescription = () => {
    const newAudioDescriptionEnabled = !audioDescriptionEnabled;
    setAudioDescriptionEnabled(newAudioDescriptionEnabled);
    SessionService.setAudioDescription(newAudioDescriptionEnabled ? "si" : "no");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 }, title: 'Settings',
    });
  }, [navigation]);

  /*
  const handleToggleVoiceControl = () => {
    const newVoiceControlEnabled = !voiceControlEnabled;
    setVoiceControlEnabled(newVoiceControlEnabled);
    SessionService.setVoiceControl(newVoiceControlEnabled ? "si" : "no");
  };
  */

  const styles = {
    settingsContainer: {
      marginVertical: 10,
      marginHorizontal: 20,
      backgroundColor: 'transparent',
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      backgroundColor: 'transparent',
      alignItems: "center",
      justifyContent: "center",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    text_type_1: {
      fontSize: 16,
      fontFamily: bodyFont,
      color: "white",
      marginTop: 4,
    },
    text_type_2: {
      fontSize: 22,
      fontFamily: bodyFont,
      color: "yellow",
      marginTop: 20,
    },
    switch_design: {
      top: 10,
    }
  };

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
          <View style={styles.settingsContainer}>
            <Text style={styles.text_type_2}> {t("Language selector")}</Text>
            <LanguageSelector/>
            <Text style={styles.text_type_2}>{t("Audio Description")}</Text>
            <Text style={styles.text_type_1}>{t("Enable audio description")}</Text>
            <Switch style={styles.switch_design}
              value={audioDescriptionEnabled}
              onValueChange={handleToggleAudioDescription}
            />
          </View>
      </View>
    </ImageBackground>
  );
};

export default SettingsPage;

/*
<View style={styles.settingsContainer}>
          <Text>Voice Control</Text>
          <Text>Enable voice control for navigation</Text>
          <Switch
            value={voiceControlEnabled}
            onValueChange={handleToggleVoiceControl}
          />
        </View>
*/
