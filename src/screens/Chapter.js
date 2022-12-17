import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Elements} from '../Constants';
import DeviceInfo from 'react-native-device-info';

const lineWidthLr = Math.round((Dimensions.get('window').width / 10) * 2);
const lineWidthM = Math.round((Dimensions.get('window').width / 10) * 1);

const Line = ({broken}) => {
  return (
    <View style={styles.line}>
      <View style={styles.underlineLr} />
      {broken ? <View style={styles.underlineMBroken} /> : <View style={styles.underlineM} />}
      <View style={styles.underlineLr} />
    </View>
  );
};

const Hexagram = (lower, upper) => {
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

const Chapter = ({route}) => {
  const chapter = route.params.chapter;
  let paragraphs = chapter.paragraphs.split('\n').map((p, i) => {
    return (
      <Text style={styles.paragraph} key={i}>
        {p + '\n\n'}
      </Text>
    );
  });
  return (
    <View style={styles.home}>
      <View style={styles.scroll}>
        <ScrollView>
          {Hexagram(Elements[chapter.lower], Elements[chapter.upper])}
          <View style={styles.words}>
            <Text style={styles.sentanceOne}>
              > {chapter.sentanceOne}{paragraphs}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const lineSize = 7;
const linePadding = 7;
const wordsPadding = 20;

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    flex: 1,
    height: Dimensions.get('window').height - 50,
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
  words: {
    marginTop: 15,
    paddingLeft: wordsPadding,
    paddingRight: wordsPadding,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'black',
    fontStyle: 'italic',
  },
  sentanceOne: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
  },
});

export default Chapter;
