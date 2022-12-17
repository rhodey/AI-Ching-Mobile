import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useStateValue} from '../state/Provider';
import * as Actions from '../state/Reducer';
import {Documents} from '../Documents';
import DeviceInfo from 'react-native-device-info';

const ListItem = ({chapter, onPress}) => {
  return (
    <View style={styles.listItem} key={chapter.num}>
      <TouchableOpacity style={styles.row} onPress={() => onPress(chapter)}>
        <Text style={styles.listItemTitle}>{`${chapter.title}`}</Text>
        <Icon style={styles.listItemIcon} name="angle-right" size={30} />
      </TouchableOpacity>
      <View style={styles.underline} />
    </View>
  );
};

const Home = ({navigation}) => {
  const [, dispatch] = useStateValue();
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(Actions.setTitle('A.I. Ching'));
    Documents.readTitles().then(setData);
  }, [dispatch]);

  function onPress(ch) {
    Documents.readChapter(ch.num).then(chapter => {
      navigation.navigate('Chapter', {chapter});
      dispatch(Actions.setTitle(`${chapter.title}`));
    });
  }

  function renderItem({item}) {
    return <ListItem chapter={item} onPress={onPress} key={item.num} />;
  }

  return (
    <View style={styles.home}>
      <View style={styles.scroll}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.num} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: DeviceInfo.hasNotch() ? 20 : 50,
  },
  scroll: {
    flex: 1,
    height: Dimensions.get('window').height - 50,
  },
  listItem: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
  },
  listItemTitle: {
    fontSize: 28,
    color: 'black',
  },
  listItemIcon: {
    position: 'absolute',
    right: 15,
    bottom: 5,
  },
  underline: {
    borderColor: '#f0f0f0',
    borderWidth: 1,
  },
});

export default Home;
