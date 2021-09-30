let initialState = {
  lat: null,
  lng: null,
};

let Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'Add':
      return Object.assign({}, state, {
        lat: action.payload.lat,
        lng: action.payload.lng,
      });
      break;
    default:
      break;
  }
  return state;
};

export default Reducer;
