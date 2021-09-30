import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import RenderHtml from 'react-native-render-html';

let Infos = React.memo(function Infos(props) {
  let [html, setHtml] = useState(null);

  let source = {
    html: html,
  };

  useEffect(async () => {
    await axios({
      method: 'GET',
      baseURL: 'https://test-pgt-dev.apnl.ws/html',
      headers: {
        'X-AP-Key': 'uD4Muli8nO6nzkSlsNM3d1Pm',
        'X-AP-DeviceUID': 'Documentation',
        'Accept-Language': ' fr-FR',
        Accept: 'text/html',
      },
    })
      .then(res => {
        setHtml(res.data);
      })
      .catch(err => {});
  }, []);

  let {width} = useWindowDimensions();

  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: 'black',
      textAlign: 'center',
      marginTop: '5%',
      marginBottom: '10%',
    },
    span: {
      marginTop: '2%',
    },
    a: {
      color: 'green',
    },
  };
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: 'white',
      }}>
      <RenderHtml
        contentWidth={width}
        source={source}
        tagsStyles={tagsStyles}
      />
    </ScrollView>
  );
});

export default Infos;
