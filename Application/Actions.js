import React from 'react';
import {Alert} from 'react-native';

export let Add = (data, datab) => async dispatch => {
  dispatch({
    type: 'Add',
    payload: {
      lat: data,
      lng: datab,
    },
  });
};
