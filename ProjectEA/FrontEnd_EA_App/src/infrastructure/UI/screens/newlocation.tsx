import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform, Alert } from "react-native";
import { ImageBackground, Image} from 'react-native';
import { Callout, Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { LocationEntity } from "../../../domain/location/location.entity";
import SearchBar from "../components/searchbar/searchbar";
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import { LocationService } from "../../../infrastructure/services/location/location.service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import { useTranslation } from "react-i18next";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

const NewLocationScreen = () => {
    const [locations, setLocationList] = useState<LocationEntity[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const mapRef = useRef<MapView>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const navigation = useNavigation();
    const [clickedLocation, setClickedLocation] = useState("");

    const locationIcon = require('../../../../assets/location_apple.png');
    const fireIcon = require('../../../../assets/location_fire.png');
    const {t} = useTranslation()
    const [activities, setActivities] = useState<LocationEntity[]>([]);

    const [selectedMarker, setSelectedMarker] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
        const response = await LocationService.getLocations();
        if (response) {
            const activities = response.data as LocationEntity[];
            setActivities(activities);
        } else {
            console.error('Error fetching activities: Response is undefined');
        }
        } catch (error) {
        console.error('Error fetching activities:', error);
        }
    };

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
        headerTitle: 'Create a Location',
        headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
        headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
    }, [navigation]);

    useEffect(() => {
        const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({});

            const { latitude, longitude } = location.coords;

            const region = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };

            mapRef.current?.animateToRegion(region);
            }
        } catch (error) {
            console.log("Error al obtener la ubicación:", error);
        }
        };

        getCurrentLocation();
    }, []);

    const calculateZoom = (importance: number) => {
        return Math.floor(18 - Math.log2(importance));
    };

    const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedMarker({ latitude, longitude });
    };

    const [nameLocation, setNameLocation] = useState("");
    const [descriptionLocation, setDescriptionLocation] = useState("");

    const createNewLocation = async () => {

        if (selectedMarker && nameLocation!="" && descriptionLocation!="") {
            const newLocation = {
                nameLocation: nameLocation,
                latLocation: selectedMarker.latitude.toString(),
                lonLocation: selectedMarker.longitude.toString(),
                descriptionLocation: descriptionLocation,
              };

            const response = await LocationService.createLocation(newLocation);

            if (response) {
                navigation.navigate('HomeScreen' as never);
            } else {
                console.error('Error creating a new location!');
            }

        } else if (!selectedMarker) {
            Alert.alert("Warning", "You must click on the map to select a location!");
        } else {
            Alert.alert("Warning", "Complete all the field to create the location!");
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        map: {
            width: '100%',
            height: '100%',
        },
        add_location_button: {
            position: 'absolute',
            bottom: 0,
            left: '44%',
            right: '44%',
            zIndex: 1,
            padding: 0,
            alignContent: 'center',
        },
        plus_icon_location: {
            width: '100%',
            height: 36,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            alignItems: "center",
            borderRadius: 12,
            flexDirection: "row",
            textAlign: 'center',
            marginBottom: 30,
        },
        name_input: {
            position: 'absolute',
            top: 0,
            left: '6%',
            right: '6%',
            width: '88%',
            zIndex: 1,
            padding: 0,
            height: 36,
            alignContent: 'center',
        },
        description_input: {
            position: 'absolute',
            top: 44,
            left: '6%',
            right: '6%',
            width: '88%',
            zIndex: 1,
            padding: 0,
            height: 36,
            alignContent: 'center',
        }
    });

    return (
        <View style={styles.container}>
        <MapView style={styles.map} ref={mapRef} onPress={handleMapPress}>
        {selectedMarker && (
          <Marker coordinate={selectedMarker}>
            <Callout>
              <Text>{t("Latitude")}: {selectedMarker.latitude}</Text>
              <Text>{t("Longitude")}: {selectedMarker.longitude}</Text>
            </Callout>
          </Marker>
        )}
        </MapView>
        <View style={styles.add_location_button}>
            <TouchableOpacity onPress={() => createNewLocation()}>
            <View style={styles.plus_icon_location}>
                <MaterialCommunityIcons color="yellow" name="upload" size={22} />
            </View>
            </TouchableOpacity>
        </View>
        <StyledTextInputs style={styles.name_input} placeholder="Name of the Location" value={nameLocation} onChangeText={setNameLocation}/>
        <StyledTextInputs style={styles.description_input} placeholder="Description" value={descriptionLocation} onChangeText={setDescriptionLocation}/>
        </View>
    );
};

export default NewLocationScreen;