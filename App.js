/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  StatusBar,
  View,
  Dimensions,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import {connect} from '@openrc/react-native-mqtt';
const resolution_voltage = 0.01960784313725490196078431372549;

import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';

var Opciones = {
  hostname: '143.198.97.197',
  port: 9001,
  protocol: 'mqtt',
  username: 'app',
  password: 'display'
};

const calculate_voltage = binary => {
  return 12 * parseInt(binary) * resolution_voltage;
};

const App = () => {
  const client = connect('mqtt://143.198.97.197:9001', Opciones);
  const [binary, setBinary] = React.useState(0);
  const [decimal, setDecimal] = React.useState(0);
  const [flag, setFlag] = React.useState(false);

  const EventoConectar = () => {
    client.subscribe('voltmeter', function (err) {
      if (!err) {
        console.log('no error');
        client.on('message', EventoMensaje);
      }
      console.log('err', err);
    });
  };

  const EventoMensaje = (topic, message) => {
    var b = parseInt(message.toString(), 2);
    if (decimal.toString() != b.toString()) {
      setDecimal(b);
      setBinary(message.toString());
      //console.log(b);
    }

    /*console.log(topic + " - " + message.toString());
     console.log(parseInt(message.toString(),2));*/
    //client.end()
  };

  React.useEffect(() => {
    if (!flag) {
      client.on('connect', EventoConectar);
      setFlag(true);
    }
    console.log('binary', calculate_voltage(decimal));
  }, [flag, binary]);
  const progressCustomStyles = {
    backgroundColor: 'red',
  };
  const barWidth = Dimensions.get('screen').width - 30;
  return (
    <SafeAreaView
      style={{height: '100%', width: '100%', backgroundColor: '#ffffff'}}>
      <StatusBar barStyle="dark-content" />
      <Text style={{marginTop: 30, fontSize: 30, textAlign: 'center'}}>
        Instrumentación
      </Text>
      <Text style={{marginTop: 20, fontSize: 30, textAlign: 'center'}}>
        Grupo 3CV14
      </Text>
      <Text style={{marginTop: 20, fontSize: 30, textAlign: 'center'}}>
        Voltmetro
      </Text>
      <View
        style={{
          marginTop: 80,
          alignItems: 'center',
          height: '100%',
        }}>
        <Text style={{ marginBottom: 10,fontSize:20}}>
          Valor binario {binary}
        </Text>
        <Text style={{marginTop: 10, marginBottom: 10,fontSize:20}}>
          Valor decimal {decimal}
        </Text>
        
        <View style={{marginTop:20}}>
          <Speedometer
            value={calculate_voltage(decimal).toFixed(3)}
            max={60}
            angle={170}>
            <Background angle={180} />
            <Arc />
            <Needle />
            <Progress />
            <Marks />
          </Speedometer>
        </View>
        <Text style={{marginBottom: 10,fontSize:30}}>
          {calculate_voltage(decimal).toFixed(3)} V
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default App;
