import React, {PureComponent} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeNavigation from '../Navigation/HomeNavigation';
import {connect, useDispatch} from 'react-redux';
import * as Actions from './Actions';
import Geolocation from 'react-native-geolocation-service';

class Application extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    await Geolocation.getCurrentPosition(
      position => {
        this.props.handleAdd(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  componentDidUpdate = (prevProps, prevState) => {};

  componentWillUnmount = () => {};

  render() {
    return (
      <NavigationContainer independent={true} ref={this.Ref}>
        <HomeNavigation />
      </NavigationContainer>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    handleAdd: (data, datab) => dispatch(Actions.Add(data, datab)),
  };
};

export default connect(null, mapDispatchToProps)(Application);
