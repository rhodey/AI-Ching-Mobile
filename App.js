import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {StateProvider} from './src/state/Provider';
import {AppReducer, InitialState} from './src/state/Reducer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from './src/screens/Home';
import ChapterList from './src/screens/ChapterList';
import Chapter from './src/screens/Chapter';
import {useStateValue} from './src/state/Provider';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const Header = ({navigation, ...props}) => {
  const isHomeScreen = props.route.name === 'Home';
  const [state] = useStateValue();
  return (
    <SafeAreaView style={{flex: 1, marginBottom: 5, backgroundColor: 'white'}}>
      <View style={styles.header}>
        <View style={styles.row}>
          {isHomeScreen && <View style={styles.headerSpacer} />}
          {!isHomeScreen && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon style={styles.headerArrow} name="arrow-left" size={30} color="white" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContain}>
            <Text style={styles.headerText}>{state.title}</Text>
          </View>
          {isHomeScreen && (
            <TouchableOpacity onPress={() => navigation.navigate('ChapterList')}>
              <Icon style={styles.headerBook} name="book" size={30} color="white" />
            </TouchableOpacity>
          )}
          {!isHomeScreen && <View style={styles.headerSpacer} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const Drawer = createDrawerNavigator();

const DrawerContent = () => {
  return <View />;
};

export default function App() {
  return (
    <StateProvider initialState={InitialState} reducer={AppReducer}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            backBehavior="history"
            drawerContent={props => <DrawerContent {...props} />}
            screenOptions={{header: Header, unmountOnBlur: true, swipeEnabled: false}}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="ChapterList" component={ChapterList} />
            <Drawer.Screen name="Chapter" component={Chapter} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </StateProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: 50,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  headerArrow: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  headerBook: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  headerTextContain: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 37,
  },
});
