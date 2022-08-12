import { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  Button,
} from "react-native";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import Header from "./Header";
import NavBar from "./NavBar";
import {
  fetchLatLongs,
  getUsername,
  getUsersLatLong,
} from "../firebase/config.js";

export default function MapScreen({ navigation }) {
  const [latLongArray, setLatLongArray] = useState(false);
  const [usersLong, setUsersLong] = useState(-2.1193);
  const [usersLat, setUsersLat] = useState(53.2587);

  function handleGiveHelpPress() {
    navigation.navigate("Map");
  }

  useEffect(() => {
    getUsersLatLong()
      .then((data) => {
        setUsersLong(data.longitude);
        setUsersLat(data.latitude);
        console.log(typeof usersLong, "<<< users Longitude");
        console.log(typeof usersLat, "<<< users Latitude");
      })
      .catch((err) => {
        console.log(err, "erro in MapScreen.jsx");
      });

    fetchLatLongs()
      .then(({ latLongs }) => {
        setLatLongArray([...latLongs]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [usersLong]);

  return (
    <View>
      <Header />
      <View contentContainerStyle={styles.container}>
        <Picker
          selectedValue={selectedValue}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -2.1193,
            longitude: 53.2587,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          region={{
            latitude: usersLat,
            longitude: usersLong,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Circle
            center={{
              latitude: usersLat,
              longitude: usersLong,
            }}
            radius={1000}
            fillColor={"rgba(27.8, 78.8, 68.6, 0.3)"}
          ></Circle>
          {latLongArray ? (
            latLongArray.map((errand) => {
              const latitude = errand.latitude;
              const longitude = errand.longitude;
              return (
                <Marker
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  key={errand.errandID}
                >
                  <Callout>
                    <Text>{errand.errandID}</Text>
                  </Callout>
                </Marker>
              );
            })
          ) : (
            <></>
          )}
        </MapView>
      </View>
      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  volunteerButton: {
    backgroundColor: "#47c9af",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    width: 270,
    margin: 20,
    padding: 10,
    marginBottom: 90,
  },
  helpButton: {
    backgroundColor: "#47c9af",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    width: 270,
    height: 100,
    margin: 20,
    padding: 10,
    marginTop: 20,
    textAlignVertical: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});
