import axios from 'axios';
import React from 'react';
import {PureComponent} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getPreciseDistance, getDistance} from 'geolib';

class News extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Actu: null,
      picture: null,
      visible: false,
      lat: null,
      lng: null,
      refresh: false,
    };
    this.handleModal = this.handleModal.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh = () => {
    this.setState(prevState => ({
      ...this.state,
      refresh: true,
    }));
    this.downloadPosts().then(() =>
      this.setState(prevState => ({
        ...this.state,
        refresh: false,
      })),
    );
  };

  downloadPosts = async () => {
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
          Actu: res.data.sort((a, b) =>
            Number(a.picture_url) > Number(b.picture_url) ? 1 : 0,
          ),
        }));
      })
      .catch(err => console.error(err));
  };

  requestLocationPermission = async () => {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Localisation',
        message: 'Autoriser la localisation de votre emplacement actuel',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
  };
  componentDidMount = async () => {
    this.downloadPosts();

    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    } else {
      this.requestLocationPermission();
    }

    Geolocation.getCurrentPosition(
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
  };
  componentDidUpdate = (prevProps, prevState) => {};

  componentWillUnmount = () => {};

  handleModal = data => {
    this.setState(prevState => ({
      ...this.state,
      picture: data,
      visible: true,
    }));
  };

  handlePost = data => {
    let dis = getPreciseDistance(
      {
        latitude: Number(this.state.lat),
        longitude: Number(this.state.lng),
      },
      {
        latitude: Number(data.item.latitude),
        longitude: Number(data.item.longitude),
      },
    );
    dis = Number(dis / 1000).toFixed(0);

    let date = <Text style={{marginTop: '5%'}}>Date</Text>;

    if (
      Number(data.item.published_at) === Date.now() ||
      Date.now() - Number(data.item.published_at) <= 86400000
    ) {
      date = <Text>Aujourd’hui</Text>;
    } else if (
      Date.now() - Number(date) >= 86400000 &&
      Date.now() - Number(date) <= 86400000 * 2
    ) {
      date = <Text>Hier</Text>;
    } else {
      let b = Date.now() - Number(data.item.published_at);
      date = <Text>Il y a {Math.round(Number(b) / 86400000)} jours</Text>;
    }
    return (
      <View
        key={data.index}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: '7%',
          padding: '3%',
          borderBottomColor: 'black',
          borderBottomWidth: 2,
        }}>
        <TouchableOpacity
          onPress={() =>
            data.item.picture_url
              ? this.handleModal(data.item.picture_url)
              : null
          }>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {data.item.title}
          </Text>
          <Text style={{fontSize: 15, fontWeight: 'normal', marginTop: '3%'}}>
            {data.item.description.slice(0, 50)} ...
          </Text>

          {data.item.picture_url ? (
            <Image
              source={{uri: data.item.picture_url}}
              style={{width: 150, height: 150}}
              fadeDuration={5}
            />
          ) : (
            <Text
              style={{fontSize: 15, fontWeight: 'normal', fontStyle: 'italic'}}>
              Aucune photo
            </Text>
          )}
          {date}
          <Text>{dis} km</Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    let {width, height} = Dimensions.get('window');

    return (
      <View style={{backgroundColor: 'white'}}>
        {this.state.Actu !== null ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refresh}
                onRefresh={this.handleRefresh}
                colors={['black']}
                title="Chargement"
              />
            }
            style={{
              backgroundColor: 'white',
            }}
            contentContainerStyle={{
              paddingBottom: '10%',
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={this.handlePost}
            data={this.state.Actu}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}
        {this.state.visible && (
          <View
            style={{
              width: '100%',
              height: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState(prevState => ({
                  ...this.state,
                  visible: false,
                }));
              }}>
              <Image
                source={{
                  uri: this.state.picture,
                }}
                style={{
                  width: '100%',
                  height: height - 70,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default News;
