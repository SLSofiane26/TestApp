import axios from 'axios';
import React from 'react';
import {PureComponent} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';

class Maps extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      lat: null,
      lng: null,
      map: false,
    };
    this.handlePosts = this.handlePosts.bind(this);
  }

  handlePosts = async () => {
    await axios({
      method: 'GET',
      baseURL: 'https://test-pgt-dev.apnl.ws/events',
      headers: {
        'X-AP-Key': 'uD4Muli8nO6nzkSlsNM3d1Pm',
        'X-AP-DeviceUID': 'Documentation',
        Accept: 'application/json',
      },
    })
      .then(res => {
        this.setState(prevState => ({
          ...this.state,
          markers: res.data,
        }));
      })
      .catch(err => console.error(err));
  };

  componentDidMount = async () => {
    await Geolocation.getCurrentPosition(
      position => {
        this.setState(prevState => ({
          ...this.state,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    this.handlePosts();
  };

  componentDidUpdate = async (prevState, prevProps) => {
    await Geolocation.getCurrentPosition(
      position => {
        if (
          position.coords.latitude !== this.state.lat ||
          position.coords.longitude !== this.state.lng
        ) {
          this.setState(prevState => ({
            ...this.state,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        }
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  componentWillUnmount = () => {};

  render() {
    let d = this.state.lat;
    let f = this.state.lng;

    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <View style={{height: '100%'}}>
          <MapView
            showsUserLocation
            showsBuildings
            showsIndoors
            showsIndoorLevelPicker
            showsMyLocationButton
            showsCompass
            scrollEnabled
            showsPointsOfInterest
            zoomControlEnabled
            zoomEnabled
            zoomTapEnabled
            showsScale
            showsTraffic
            style={styles.map}
            initialRegion={{
              latitude: this.props.lat,
              longitude: this.props.lng,
              latitudeDelta: 0.0052,
              longitudeDelta: 0.0051,
            }}>
            <Marker
              coordinate={{
                latitude: Number(this.state.lat),
                longitude: Number(this.state.lng),
              }}
              title={'Vous êtes içi'}
            />
            {this.state.markers.length > 0 &&
              this.state.markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={marker.title}
                  description={marker.description}
                />
              ))}
          </MapView>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

let MapStateToProps = state => {
  return {
    lng: state.lng,
    lat: state.lat,
  };
};

export default connect(MapStateToProps, null)(Maps);
