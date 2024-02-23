import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
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
import { ActivityEntity, ActivityShare } from "../../../domain/activity/activity.entity";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Publication, PublicationEntity } from "../../../domain/publication/publication.entity";
import { PublicationService } from "../../services/publication/publication.service";

async function loadFonts() {
    await Font.loadAsync({
      'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
      'SFNS': require('../../../../assets/fonts/SFNS.otf'),
    });
}

interface RouteParams {
    uuid?: string;
}

export default function ActivityInfo() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const route = useRoute();
    const {
        uuid
      }: RouteParams = route.params || {};

    const [activity, setActivity] = useState<ActivityShare>();
    const [participants, setParticipants] = useState<string[]>();
    const [myId, setMyId] = useState<string>();
    const [participating, setParticipating] = useState<boolean>();

    const titleFont = Platform.select({
        ios: 'Rafaella',
        android: 'Rafaella',
    });
    const bodyFont = Platform.select({
        ios: 'SFNS',
        android: 'SFNS',
    });

    const [listPublicationsActivity, setListPublicationsActivity] = useState<Publication[]>([]);
    const [numPublicationsActivity, setNumPublicationsActivity] = useState<number>(0);
    const [recargar, setRecargar] = useState<string>('');
    const [isCreatorOfActivity, setIsCreatorOfActivity] = useState<boolean>(false);
    const [userProfilePhotos, setUserProfilePhotos] = useState<Map<string, string[]>>(new Map());

    useFocusEffect(
      React.useCallback(() => {
        const getUser = async () => {
          const userId = await SessionService.getCurrentUser();
          if (userId) {
            try {
              setMyId(userId);
            } catch (error) {
              console.error("Error:", error);
            }
          }
        };
        getUser();
      }, [])
    );

    const obtainActivity = async () => {
        if (uuid){
          console.log("uuid Activity:", uuid);
            try {
                const response = await ActivityService.getActivityById(uuid);
                if (response) {
                  const activity = response.data as ActivityShare;
                  console.log("ACTIVITY CARGAA EN INFO: ", activity);
                  setActivity(activity);
                  setParticipants(activity.participantsActivity);

                  const userId = await SessionService.getCurrentUser();
                  if (activity && activity.participantsActivity && userId) {
                    const index = activity.participantsActivity?.indexOf(userId);
                    if (index !== undefined && index !== -1) {
                      // PARTICIPO
                      setParticipating(true);
                    } else {
                      // NO PARTICIPO
                      setParticipating(false);
                    }
                  }
                  console.log("creatorActivity", activity.creatorActivity.uuid);
                  console.log("userId", userId);
                  if(activity.creatorActivity.uuid === userId){
                    console.log("creé la actividad");
                    setIsCreatorOfActivity(true);
                  }
                  else{
                    console.log("no creé la actividad");
                    setIsCreatorOfActivity(false);
                  }

                } else {
                  console.error('Error fetching activities: Response is undefined');
                }
            } catch (error) {
            console.error('Error fetching activities:', error);
            }
        }
    };

    useEffect(() => {
        obtainActivity();
        loadFonts().then(() => {
          setFontsLoaded(true);
        });
      }, []);
      
    useEffect(() => {
    if (activity) {
        getPublicationsForActivity();
    }
    }, [activity]);

    useEffect(() => {
      const fetchUserProfilePhotos = async () => {
        const photos = new Map<string, string[]>();
    
        if (activity && activity.participantsActivity && activity.uuid) {
          const photosForActivity = await Promise.all(
            activity.participantsActivity.map((userId) => getUserProfilePhoto(userId))
          );
    
          const cleanedPhotosForActivity = photosForActivity.filter((photo) => photo !== null) as string[];
    
          photos.set(activity.uuid, cleanedPhotosForActivity);
        }
    
        setUserProfilePhotos(photos);
      };
    
      fetchUserProfilePhotos();
    }, [activity]);
    
    const getUserProfilePhoto = async (userId: string) => {
      try {
          const response = await CRUDService.getUser(userId);
          if (response) {
              const user = response.data as UserEntity;
              return user.photoUser;
          } else {
              console.error('Error fetching user:', userId);
              return null;
          }
      } catch (error) {
          console.error('Error fetching user:', error);
          return null;
      }
    };



    React.useLayoutEffect(() => {
        navigation.setOptions({
        headerTitle: 'Activity',
            headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
            headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
    }, [navigation]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "transparent",
            alignItems: "center",
            marginTop: 20,
            justifyContent: "center", 
        },
        inside_container: {
            flex: 1,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
        },
        backgroundImage: {
            flex: 1,
            resizeMode: 'cover',
        },
        text_activity_name: {
            color: 'yellow',
            fontFamily: titleFont,
            fontSize: 28,
            paddingTop: 8,
        },
        text_activity_description: {
          color: 'white',
          fontFamily: bodyFont,
          fontSize: 16,
          marginTop: 8,
        },
        text_activity_date: {
          color: "#66fcf1",
          fontFamily: bodyFont,
          fontSize: 14,
          marginTop: 8,
        },
        text_activity_time: {
          color: "#66fcf1",
          fontFamily: bodyFont,
          fontSize: 14,
          marginBottom: 8,
        },
        scroll_profiles: {
            paddingLeft: 10,
            width: 300,
            marginTop: 2,
            marginBottom: 2,
        },
        scroll_profiles_content: {
          justifyContent: 'center',
        },        
        plus_icon: {
            width: 46,
            height: 46,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            alignItems: "center",
            borderRadius: 40,
            marginRight: 10,
            marginBottom: 10,
          },
          post_complete: {
            alignItems: 'center',
            marginRight: 4,
            marginLeft: 4,
          },
          post_description: {
            alignItems: 'center',
            width: 120,
            backgroundColor: 'black',
            marginTop: 4,
            borderRadius: 16,
          },
          text_post: {
            fontSize: 16,
            fontFamily: bodyFont,
            color: "white",
            marginTop: 4,
        
          },
          time_post: {
            fontSize: 12,
            fontFamily: bodyFont,
            color: "yellow",
            marginTop: 2,
            marginBottom: 6,
          },
          post_images: {
            width: 120,
            height: 120,
            borderRadius: 16,
            resizeMode: 'cover',
          },
          scroll_posts: {
            marginTop: 10,
            marginBottom: 0,
            marginLeft: 0,
            alignSelf: 'flex-start', // Agregar este estilo
          },
          
          scrollViewContent: {
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-start", // Alinear el contenido en la parte superior
          },
          participant_profile_image: {
            width: 46,
            height: 46,
            borderRadius: 40,
            marginRight: 10,
          },
    });

    const getPublicationsForActivity = async () => {
        const publicationIds = activity?.publicationActivity;
        if (publicationIds){
            for (const publicationId of publicationIds) {
                try {
                  const response = await PublicationService.onePublication(publicationId);
                  const publication = response.data;
                  setListPublicationsActivity((prevList) => [...prevList, publication]);
                } catch (error) {
                  console.error("Error al obtener la publicación:", error);
                }
              }
        }
    };


    const handleJoinLeaveActivity = async () => {
      if (activity && participants && myId) {
        const index = activity.participantsActivity?.indexOf(myId);
        if (index !== undefined && index !== -1) {
          // Actualizar para quitar mi ID de la lista.
          activity.participantsActivity?.splice(index, 1);
        } else {
          // Actualizar para poner mi ID en la lista
          activity.participantsActivity?.push(myId);
        }
        await ActivityService.updateActivity(activity.uuid!, activity);
        navigation.navigate('HomeScreen' as never);
      }
    };

    const handleGoToScreenUser = (uuid:string) => {
      navigation.navigate("UserScreen" as never, {uuid} as never);
    };

    return (
        <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
          <View style={styles.container}>
            {activity && (
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.inside_container}>
                  <Text style={styles.text_activity_name}>{activity.nameActivity}</Text>
                  <Text style={styles.text_activity_description}>{activity.descriptionActivity}</Text>
                  <Text style={styles.text_activity_date}>
                    {new Date(activity.dateActivity).getDate()}.
                    {new Date(activity.dateActivity).getMonth() + 1}.
                    {new Date(activity.dateActivity).getFullYear()}
                  </Text>
                  <Text style={styles.text_activity_time}>{activity.hoursActivity[0]} - {activity.hoursActivity[1]}</Text>
                  {!isCreatorOfActivity && (
                    <TouchableOpacity style={styles.plus_icon} onPress={handleJoinLeaveActivity}>
                    <MaterialCommunityIcons color="#66fcf1" name={participating ? "minus" : "plus"} size={20} />
                  </TouchableOpacity>
                  )}
                  <Text style={styles.text_activity_description}>
                    Participants
                  </Text>
                  <ScrollView style={styles.scroll_profiles} horizontal contentContainerStyle={styles.scroll_profiles_content}>
                    {activity.uuid &&
                      userProfilePhotos.get(activity.uuid)?.map((photoUrl, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                          const userId = activity.participantsActivity?.[index];
                          if (userId) {
                            handleGoToScreenUser(userId);
                          }
                        }}>
                          <Image style={styles.participant_profile_image} source={photoUrl ? { uri: photoUrl } : undefined} />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                  <ScrollView horizontal>
                    {listPublicationsActivity.reverse().map((publication, index) => (
                      <View key={index} style={styles.post_complete}>
                        <Text style={styles.time_post}>{new Date(publication.createdAt).toLocaleString()}</Text>
                        <Image style={styles.post_images} source={{ uri: publication.photoPublication[0] }}/>
                        <Text style={styles.text_post}>{publication.textPublication}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            )}
          </View>
        </ImageBackground>
      );      
}
    