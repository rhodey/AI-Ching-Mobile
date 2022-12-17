import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage {
  static getItem = async key => {
    return await AsyncStorage.getItem(key);
  };

  static setItem = async (key, object) => {
    return await AsyncStorage.setItem(key, object);
  };

  static setDocumentsReady = async () => {
    return await this.setItem('documentsReady', 'true');
  };

  static isDocumentsReady = async () => {
    let ready = await this.getItem('documentsReady');
    return ready !== null;
  };
}
