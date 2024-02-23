import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Platform } from "react-native";
import { ImageBackground} from 'react-native';
import { Callout, Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { LocationEntity } from "../../../domain/location/location.entity";
import SearchBar from "../components/searchbar/searchbar";
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import { LocationService } from "../../../infrastructure/services/location/location.service";
import { ActivityService } from "../../../infrastructure/services/activity/activity.service";
import { ActivityEntity } from "../../../domain/activity/activity.entity";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import { Picker } from "@react-native-picker/picker";
import ButtonGradientBirthdate from "../components/buttons/Button_Type_Birthdate";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

interface RouteParams {
    uuid?: string;
}

async function loadFonts() {
    await Font.loadAsync({
      'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
      'SFNS': require('../../../../assets/fonts/SFNS.otf'),
    });
}

export default function CreateActivityScreen() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const route = useRoute();
    const {t} = useTranslation()
    const {
        uuid
      }: RouteParams = route.params || {};

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

    React.useLayoutEffect(() => {
        navigation.setOptions({
        headerTitle: 'Create an Activity',
          headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
          headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
    }, [navigation]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: "transparent",
            alignItems: "center",
        },
        scroll_style: {
            flex: 1,
        },
        backgroundImage: {
            flex: 1,
            resizeMode: 'cover',
        },
        input: {
            width: 300,
            height: 40,
        },
        picker_left: {
            color: "black",
            fontWeight:'bold',
            backgroundColor: "#66fcf1",
            borderWidth: 1,
            borderColor: "transparent",
            borderRadius: 14,
            marginTop: 20,
            marginBottom: 0,
            width: 140,
            height: 62,
            marginRight: 20,
        },
        picker_right: {
            color: "black",
            fontWeight:'bold',
            backgroundColor: "#66fcf1",
            borderWidth: 1,
            borderColor: "transparent",
            borderRadius: 14,
            marginTop: 20,
            marginBottom: 0,
            width: 140,
            height: 62,
        },
        pickerItem: {
            fontSize: 14,
            color: "black",
            fontFamily: bodyFont,
            height: 60,
        },
        picker_row: {
            flexDirection: "row",
        },
        title: {
            color: 'yellow',
            fontFamily: titleFont,
            fontSize: 28,
            paddingTop: 8,
            marginTop: 20,
        },
        buttonContainerB: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
        },
        dateTimePicker: {
            backgroundColor: 'transparent',
            width: 68,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            marginTop:4,
        },
        map: {
            width: 300,
            height: 200,
            borderRadius: 12,
        },
        map_container: {
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 300,
            height: 200,
            display: 'flex',
            marginTop: 20,
            borderRadius: 20,
        },
        plus_icon_activity: {
            width: 160,
            height: 46,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            alignItems: "center",
            borderRadius: 40,
            marginTop: 20,
            flexDirection: "row",
        },
        text_activity_none: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginRight: 4,
            marginLeft: 4,
        },
        start_text: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 18,
            marginBottom: -16,
            marginRight: 20,
            width: 140,
            textAlign: 'center',
        },
        end_text: {
            color: 'white',
            fontFamily: bodyFont,
            fontSize: 16,
            marginTop: 18,
            marginBottom: -16,
            width: 140,
            textAlign: 'center',
        },
    });

    const createNewActivity = async () => {
        const startTime = new Date(`2000-01-01T${startHour}:00`);
        const endTime = new Date(`2000-01-01T${endHour}:00`);

        const userId = await SessionService.getCurrentUser();

        console.log("---> CREATE ACTIVITY: " + userId);
        console.log("---> CREATE ACTIVITY: " + endTime);
        console.log("---> CREATE ACTIVITY: " + startTime);

        console.log("FIELDS: (1) " + userId +  " (2) " + nameActivity +  " (3) " + dateActivity +  " (4) " + startHour +  " (5) " + endHour +  " (6) " + uuid +  " (7) " + descriptionActivity +  " (8) " + privacyActivity +  " (9) " + roleActivity);

        if (userId && nameActivity && dateActivity && startHour && endHour && descriptionActivity && privacyActivity && roleActivity && (endTime > startTime)) {
            const newActivity = {
                nameActivity: nameActivity,
                creatorActivity: userId,
                participantsActivity: [userId],
                dateActivity: dateActivity,
                hoursActivity: [startHour, endHour],
                idLocation: uuid,
                descriptionActivity: descriptionActivity,
                privacyActivity: JSON.parse(privacyActivity),
                roleActivity: roleActivity as 'common' | 'verificado' | 'empresa',
              };

            const response = await ActivityService.createActivity(newActivity);

            if (response) {
                navigation.navigate('HomeScreen' as never);
            } else {
                console.error('Error creating a new activity!');
            }

        } else if (endTime <= startTime) {
            Alert.alert("Warning", "The ending time must be later than the starting time!");
        } else {
            Alert.alert("Warning", "Complete all the field to create the activity!");
        }
    };

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setSelectedDate(selectedDate);
          setDateActivity(selectedDate.toISOString());
        }
    };

    const [endHourOptions, setEndHourOptions] = useState([]);
    const [nameActivity, setNameActivity] = useState("");
    const [dateActivity, setDateActivity] = useState("");
    const [startHour, setStartHour] = useState("");
    const [endHour, setEndHour] = useState("");
    const [locationId, setLocationId] = useState("");
    const [descriptionActivity, setDescriptionActivity] = useState("");
    const [privacyActivity, setPrivacyActivity] = useState("");
    const [roleActivity, setRoleActivity] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [birthdateUser, setBirthdateUser] = useState("");
    const mapRef = useRef<MapView>(null);
    const fireIcon = require('../../../../assets/location_fire.png');
    const [location, setLocation] = useState<LocationEntity>();

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                if (uuid){
                    const response = await LocationService.getLocation(uuid.toString());
                    if (response){
                        const activityLocation = response.data as LocationEntity;
                        setLocation(activityLocation);
                        const latitude = parseFloat(activityLocation.latLocation);
                        const longitude = parseFloat(activityLocation.lonLocation);
                        const region = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                        };

                        mapRef.current?.animateToRegion(region);
                    } 
                }
            } catch (error) {
                console.log("Error al obtener la ubicación: ", error);
            }
        };
        getCurrentLocation();
    }, []);

    return (
        <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
        <ScrollView style={styles.scroll_style}>
            <View style={styles.container}>
                <Text style={styles.title}>{t("New Activity")}</Text>
                <StyledTextInputs style={styles.input} placeholder="Name of the Activity" value={nameActivity} onChangeText={setNameActivity}/>
                <StyledTextInputs style={styles.input} placeholder="Description" value={descriptionActivity} onChangeText={setDescriptionActivity}/>
                <View style={styles.buttonContainerB}>
                    <ButtonGradientBirthdate onPress={handleShowDatePicker}/>
                </View>
                {showDatePicker && (
                    <DateTimePicker value={selectedDate} mode="date" display="default" style={styles.dateTimePicker} onChange={handleDateChange}/>
                )}
                <View style={styles.picker_row}>
                    <Text style={styles.start_text}>{t("Starting time")}</Text>
                    <Text style={styles.end_text}>{t("Ending time")}</Text>
                </View>
                <View style={styles.picker_row}>
                    <Picker selectedValue={startHour} style={styles.picker_left} itemStyle={styles.pickerItem} onValueChange={(startHour) => setStartHour(startHour)}>
                        <Picker.Item label="00:00" value="00:00" />
                        <Picker.Item label="00:30" value="00:30" />
                        <Picker.Item label="01:00" value="01:00" />
                        <Picker.Item label="01:30" value="01:30" />
                        <Picker.Item label="02:00" value="02:00" />
                        <Picker.Item label="02:30" value="02:30" />
                        <Picker.Item label="03:00" value="03:00" />
                        <Picker.Item label="03:30" value="03:30" />
                        <Picker.Item label="04:00" value="04:00" />
                        <Picker.Item label="04:30" value="04:30" />
                        <Picker.Item label="05:00" value="05:00" />
                        <Picker.Item label="05:30" value="05:30" />
                        <Picker.Item label="06:00" value="06:00" />
                        <Picker.Item label="06:30" value="06:30" />
                        <Picker.Item label="07:00" value="07:00" />
                        <Picker.Item label="07:30" value="07:30" />
                        <Picker.Item label="08:00" value="08:00" />
                        <Picker.Item label="08:30" value="08:30" />
                        <Picker.Item label="09:00" value="09:00" />
                        <Picker.Item label="09:30" value="09:30" />
                        <Picker.Item label="10:00" value="10:00" />
                        <Picker.Item label="10:30" value="10:30" />
                        <Picker.Item label="11:00" value="11:00" />
                        <Picker.Item label="11:30" value="11:30" />
                        <Picker.Item label="12:00" value="12:00" />
                        <Picker.Item label="12:30" value="12:30" />
                        <Picker.Item label="13:00" value="13:00" />
                        <Picker.Item label="13:30" value="13:30" />
                        <Picker.Item label="14:00" value="14:00" />
                        <Picker.Item label="14:30" value="14:30" />
                        <Picker.Item label="15:00" value="15:00" />
                        <Picker.Item label="15:30" value="15:30" />
                        <Picker.Item label="16:00" value="16:00" />
                        <Picker.Item label="16:30" value="16:30" />
                        <Picker.Item label="17:00" value="17:00" />
                        <Picker.Item label="17:30" value="17:30" />
                        <Picker.Item label="18:00" value="18:00" />
                        <Picker.Item label="18:30" value="18:30" />
                        <Picker.Item label="19:00" value="19:00" />
                        <Picker.Item label="19:30" value="19:30" />
                        <Picker.Item label="20:00" value="20:00" />
                        <Picker.Item label="20:30" value="20:30" />
                        <Picker.Item label="21:00" value="21:00" />
                        <Picker.Item label="21:30" value="21:30" />
                        <Picker.Item label="22:00" value="22:00" />
                        <Picker.Item label="22:30" value="22:30" />
                        <Picker.Item label="23:00" value="23:00" />
                        <Picker.Item label="23:30" value="23:30" />
                    </Picker>
                    <Picker selectedValue={endHour} style={styles.picker_right} itemStyle={styles.pickerItem} onValueChange={(endHour) => setEndHour(endHour)}>
                        <Picker.Item label="00:00" value="00:00" />
                        <Picker.Item label="00:30" value="00:30" />
                        <Picker.Item label="01:00" value="01:00" />
                        <Picker.Item label="01:30" value="01:30" />
                        <Picker.Item label="02:00" value="02:00" />
                        <Picker.Item label="02:30" value="02:30" />
                        <Picker.Item label="03:00" value="03:00" />
                        <Picker.Item label="03:30" value="03:30" />
                        <Picker.Item label="04:00" value="04:00" />
                        <Picker.Item label="04:30" value="04:30" />
                        <Picker.Item label="05:00" value="05:00" />
                        <Picker.Item label="05:30" value="05:30" />
                        <Picker.Item label="06:00" value="06:00" />
                        <Picker.Item label="06:30" value="06:30" />
                        <Picker.Item label="07:00" value="07:00" />
                        <Picker.Item label="07:30" value="07:30" />
                        <Picker.Item label="08:00" value="08:00" />
                        <Picker.Item label="08:30" value="08:30" />
                        <Picker.Item label="09:00" value="09:00" />
                        <Picker.Item label="09:30" value="09:30" />
                        <Picker.Item label="10:00" value="10:00" />
                        <Picker.Item label="10:30" value="10:30" />
                        <Picker.Item label="11:00" value="11:00" />
                        <Picker.Item label="11:30" value="11:30" />
                        <Picker.Item label="12:00" value="12:00" />
                        <Picker.Item label="12:30" value="12:30" />
                        <Picker.Item label="13:00" value="13:00" />
                        <Picker.Item label="13:30" value="13:30" />
                        <Picker.Item label="14:00" value="14:00" />
                        <Picker.Item label="14:30" value="14:30" />
                        <Picker.Item label="15:00" value="15:00" />
                        <Picker.Item label="15:30" value="15:30" />
                        <Picker.Item label="16:00" value="16:00" />
                        <Picker.Item label="16:30" value="16:30" />
                        <Picker.Item label="17:00" value="17:00" />
                        <Picker.Item label="17:30" value="17:30" />
                        <Picker.Item label="18:00" value="18:00" />
                        <Picker.Item label="18:30" value="18:30" />
                        <Picker.Item label="19:00" value="19:00" />
                        <Picker.Item label="19:30" value="19:30" />
                        <Picker.Item label="20:00" value="20:00" />
                        <Picker.Item label="20:30" value="20:30" />
                        <Picker.Item label="21:00" value="21:00" />
                        <Picker.Item label="21:30" value="21:30" />
                        <Picker.Item label="22:00" value="22:00" />
                        <Picker.Item label="22:30" value="22:30" />
                        <Picker.Item label="23:00" value="23:00" />
                        <Picker.Item label="23:30" value="23:30" />
                    </Picker>
                </View>
                <View style={styles.map_container}>
                    <MapView style={styles.map} ref={mapRef}>
                    {location && (
                        <Marker
                            coordinate={{
                            latitude: parseFloat(location.latLocation),
                            longitude: parseFloat(location.lonLocation),
                            }}
                            image={fireIcon}
                            style={{ width: 40, height: 40 }}
                        />
                        )}
                    </MapView>
                </View>
                <View style={styles.picker_row}>
                    <Picker selectedValue={roleActivity} style={styles.picker_left} itemStyle={styles.pickerItem} onValueChange={(roleActivity) => setRoleActivity(roleActivity)}>
                        <Picker.Item label="Verified" value="verificado" />
                        <Picker.Item label="Common" value="common" />
                        <Picker.Item label="Business" value="empresa" />
                    </Picker>
                    <Picker selectedValue={privacyActivity} style={styles.picker_right} itemStyle={styles.pickerItem} onValueChange={(privacyActivity) => setPrivacyActivity(privacyActivity)}>
                        <Picker.Item label="Private" value="true" />
                        <Picker.Item label="Public" value="false" />
                    </Picker>
                </View>
                <TouchableOpacity onPress={() => createNewActivity()}>
                    <View style={styles.plus_icon_activity}>
                        <MaterialCommunityIcons color="yellow" name="flash" size={20} />
                        <Text style={styles.text_activity_none}>{t("Create Activity")}</Text>
                        <MaterialCommunityIcons color="yellow" name="flash" size={20} />
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </ImageBackground>
    );
}

