import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

let Register = React.memo(function Register(props) {
  let [formulaire, setFormulaire] = useState({
    name: null,
    email: null,
    phone: null,
    picture: null,
  });
  let [error, setError] = useState(false);

  let isValid = formulaire => {
    let valid = true;
    Object.values(formulaire).forEach(val => {
      if (!val) {
        valid = false;
      }
    });
    return valid;
  };

  let re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let handlePicture = async () => {
    await ImagePicker.openPicker({
      cropping: true,
      width: 1700,
      height: 1800,
      cropperTintColor: 'white',
      cropperCancelText: 'Annuler',
      cropperStatusBarColor: 'white',
      cropperActiveWidgetColor: 'black',
      cropperChooseText: 'Choisir',
      cropperToolbarColor: 'white',
      loadingLabelText: 'Chargement',
      cropperToolbarTitle: 'APPSPANEL',
    }).then(res => {
      setFormulaire({
        ...formulaire,
        picture: res.path,
      });
    });
  };

  let handleValidate = async () => {
    let form = {};
    form.name = formulaire.name;
    form.phone = formulaire.phone;
    form.email = formulaire.email;
    if (
      isValid(form) &&
      !isNaN(form.phone) &&
      re.test(String(form.email).toLocaleLowerCase())
    ) {
      //let formb = new FormData();
      //formb.append('picture', formulaire.picture);
      //formb.append('name', JSON.stringify(form.name));
      //formb.append('email', JSON.stringify(form.email));
      //formb.append('phone', JSON.stringify(form.phone));

      await axios({
        method: 'POST',
        baseURL: 'https://test-pgt-dev.apnl.ws/authentication/register',
        headers: {
          'X-AP-Key': 'uD4Muli8nO6nzkSlsNM3d1Pm',
          'X-AP-DeviceUID': 'Documentation',
          Accept: 'application/json',
          'Accept-Language': 'fr-FR',
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(res => {
          props.navigation.navigate('News');
        })
        .catch(err => setError(true));
      setTimeout(() => {
        setError(false);
      }, 6000);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 6000);
    }
  };

  return (
    <ScrollView
      scrollEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginTop: Platform.OS === 'android' ? '10%' : '15%',
        }}>
        <Text
          style={{
            textTransform: 'uppercase',
            textShadowColor: 'black',
            fontSize: 25,
          }}>
          Inscription APPSPANEL
        </Text>
      </View>

      <View style={Style.bloc}>
        <TextInput
          keyboardAppearance="light"
          placeholder="Nom"
          placeholderTextColor="grey"
          autoCompleteType="name"
          editable
          style={Style.input}
          enablesReturnKeyAutomatically
          onChangeText={val =>
            setFormulaire({
              ...formulaire,
              name: val,
            })
          }
        />
        {error && !formulaire.name && (
          <Text style={Style.error}>Veuillez entrer votre nom</Text>
        )}
      </View>

      <View style={Style.bloc}>
        <TextInput
          keyboardType="email-address"
          autoCompleteType="email"
          editable
          style={Style.input}
          placeholder="Email"
          placeholderTextColor="grey"
          keyboardAppearance="light"
          enablesReturnKeyAutomatically
          onChangeText={val => setFormulaire({...formulaire, email: val})}
        />
        {formulaire.email !== null &&
          !re.test(String(formulaire.email).toLowerCase()) && (
            <Text style={Style.error}>
              Veuillez entrer une adresse email valide
            </Text>
          )}
        {error && !formulaire.email && (
          <Text style={Style.error}>Veuillez entrer une adresse email</Text>
        )}
      </View>

      <View style={Style.bloc}>
        <TextInput
          keyboardType="phone-pad"
          autoCompleteType="tel"
          editable
          style={Style.input}
          placeholder="Numéro de téléphone"
          placeholderTextColor="grey"
          keyboardAppearance="light"
          enablesReturnKeyAutomatically
          onChangeText={val =>
            setFormulaire({
              ...formulaire,
              phone: val,
            })
          }
        />
        {formulaire.phone !== null && isNaN(formulaire.phone) && (
          <Text style={Style.error}>
            Veuillez entrer votre numéro de téléphone
          </Text>
        )}
        {error && !formulaire.phone && (
          <Text style={Style.error}>
            Veuillez entrer votre numéro de téléphone
          </Text>
        )}
      </View>

      <View
        style={{
          width: '100%',
          marginTop: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => handlePicture()}
          style={{
            width: '50%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            height: 50,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>Prendre une photo</Text>
        </TouchableOpacity>
        {formulaire.picture && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <TouchableOpacity>
              <Image
                source={{uri: formulaire.picture}}
                style={{width: 150, height: 150, marginTop: '5%'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '40%',
                backgroundColor: 'red',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 10,
                marginTop: '5%',
                height: 50,
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}
              onPress={() =>
                setFormulaire({
                  ...formulaire,
                  picture: null,
                })
              }>
              <Text style={{color: 'white', marginTop: '2%'}}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        style={{
          width: '100%',
          marginTop: '10%',
          marginBottom: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => handleValidate()}
          style={{
            width: '50%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            height: 50,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
});

let Style = StyleSheet.create({
  input: {
    width: '90%',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    height: 60,
    paddingLeft: '4%',
  },
  error: {
    color: 'red',
    fontSize: 15,
  },
  basic: {
    color: 'black',
    fontSize: 15,
  },
  bloc: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: '10%',
  },
  button: {
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    height: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default Register;
