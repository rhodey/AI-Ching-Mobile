import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import {Elements} from '../Constants';
import {useStateValue} from '../state/Provider';
import * as Actions from '../state/Reducer';
import {Storage} from '../Storage';
import {Documents} from '../Documents';
import DeviceInfo from 'react-native-device-info';
import 'react-native-get-random-values';

const elementsArr = Object.keys(Elements).map(key => Elements[key]);

const Line = ({broken}) => {
  return (
    <View style={styles.line}>
      <View style={styles.underlineLr} />
      {broken ? <View style={styles.underlineMBroken} /> : <View style={styles.underlineM} />}
      <View style={styles.underlineLr} />
    </View>
  );
};

const Hexagram = ({lower, upper}) => {
  return (
    <View style={styles.lines}>
      <Line broken={!upper[2]} />
      <Line broken={!upper[1]} />
      <Line broken={!upper[0]} />
      <Line broken={!lower[2]} />
      <Line broken={!lower[1]} />
      <Line broken={!lower[0]} />
    </View>
  );
};

function rand8() {
  return Math.floor(Math.random() * 100) % 8;
}

function heads() {
  // eslint-disable-next-line no-undef
  let test = crypto.getRandomValues(new Uint8Array(1));
  let number = parseInt(test[0], 10);
  return number % 2 !== 0;
}

function rand3() {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    if (heads()) {
      sum += 3;
    } else {
      sum += 2;
    }
  }
  return sum % 2 !== 0;
}

const Home = ({navigation}) => {
  const [, dispatch] = useStateValue();
  const [lower, setLower] = useState(elementsArr[rand8()]);
  const [upper, setUpper] = useState(elementsArr[rand8()]);
  const [timer, setTimer] = useState(null);
  const [timeoutMs, setTimeoutMs] = useState(250);

  function onPress() {
    clearInterval(timer);
    setTimeoutMs(400);
    setLower(elementsArr[rand8()]);
    setUpper(elementsArr[rand8()]);
  }

  useEffect(() => {
    dispatch(Actions.setTitle('A.I. Ching'));
    Storage.isDocumentsReady().then(ready => {
      if (!ready) {
        Documents.prep().then(Storage.setDocumentsReady);
      }
    });
    setTimer(
      setInterval(() => {
        setLower(elementsArr[rand8()]);
        setUpper(elementsArr[rand8()]);
      }, timeoutMs),
    );
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function next(nextTimeoutMs) {
    setTimer(
      setTimeout(() => {
        if (nextTimeoutMs === 1250) {
          let low = [];
          low.push(rand3());
          low.push(rand3());
          low.push(rand3());
          setLower(low);
          let upp = [];
          upp.push(rand3());
          upp.push(rand3());
          upp.push(rand3());
          setUpper(upp);
        } else {
          setLower(elementsArr[rand8()]);
          setUpper(elementsArr[rand8()]);
        }
        setTimeoutMs(nextTimeoutMs);
      }, timeoutMs),
    );
  }

  useEffect(() => {
    switch (timeoutMs) {
      case 400:
        next(750);
        break;

      case 750:
        next(1000);
        break;

      case 1000:
        next(1250);
        break;

      case 1250:
        setTimeout(() => {
          let hexKey = lower.join('') + upper.join('');
          Documents.readHexMap().then(chapterNumbers => {
            let number = chapterNumbers[hexKey];
            Documents.readChapter(number).then(chapter => {
              dispatch(Actions.setTitle(`${chapter.title}`));
              navigation.navigate('Chapter', {chapter});
            });
          });
        }, 1500);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutMs]);

  return (
    <View style={styles.home}>
      <Hexagram lower={lower} upper={upper} />
      {timeoutMs === 250 && <TouchableOpacity style={styles.button} onPress={onPress} />}
      {timeoutMs === 250 && (
        <Text style={styles.text} onPress={onPress}>
          Go!
        </Text>
      )}
    </View>
  );
};

const lineSize = 7;
const linePadding = 7;

const lineWidthLr = Math.round((Dimensions.get('window').width / 10) * 2);
const lineWidthM = Math.round((Dimensions.get('window').width / 10) * 1);

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  lines: {
    marginTop: DeviceInfo.hasNotch() ? 35 : 70,
    alignItems: 'center',
  },
  line: {
    flexDirection: 'row',
    paddingTop: linePadding,
    paddingBottom: linePadding,
  },
  underlineLr: {
    width: lineWidthLr,
    borderColor: 'black',
    borderWidth: lineSize,
  },
  underlineM: {
    width: lineWidthM,
    borderColor: 'black',
    borderWidth: lineSize,
  },
  underlineMBroken: {
    width: lineWidthM,
  },
  button: {
    position: 'absolute',
    bottom: 70,
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    position: 'absolute',
    bottom: 90,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
