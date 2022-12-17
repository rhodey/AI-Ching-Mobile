import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {Elements} from './Constants';

export class Documents {
  static readAIChingToString = () => {
    return new Promise((res, rej) => {
      if (Platform.OS === 'android') {
        RNFS.readFileAssets('AIChing.txt').then(res).catch(rej);
      } else {
        RNFS.readFile(`${RNFS.MainBundlePath}/AIChing.txt`).then(res).catch(rej);
      }
    });
  };

  static writeAIChingToDocuments = string => {
    let path = RNFS.DocumentDirectoryPath + '/AIChing.txt';
    return RNFS.writeFile(path, string, 'utf8');
  };

  static prep = () => {
    return Documents.readAIChingToString().then(Documents.writeAIChingToDocuments);
  };

  static getFileSize = () => {
    let path = RNFS.DocumentDirectoryPath + '/AIChing.txt';
    return RNFS.stat(path).then(stat => stat.size);
  };

  static readLines = (cb, err) => {
    let path = RNFS.DocumentDirectoryPath + '/AIChing.txt';
    Documents.getFileSize()
      .then(async fileSize => {
        let position = 0;
        let left = '';
        while (position < fileSize) {
          let length = Math.min(4096, fileSize - position);
          let string = await RNFS.read(path, length, position);
          let strings = string.split('\n');
          cb(left + strings[0]);
          strings = strings.slice(1);
          strings.forEach((str, si) => {
            if (si < strings.length - 1) {
              cb(str);
            }
          });
          left = strings[strings.length - 1];
          position += length;
        }
        cb(left);
        cb(null);
      })
      .catch(err);
  };

  static isTitle = line => {
    return (
      line.indexOf('(') >= 0 &&
      line.indexOf(')') >= 0 &&
      (line.indexOf('1.') >= 0 ||
        line.indexOf('2.') >= 0 ||
        line.indexOf('3.') >= 0 ||
        line.indexOf('4.') >= 0 ||
        line.indexOf('5.') >= 0 ||
        line.indexOf('6.') >= 0 ||
        line.indexOf('7.') >= 0 ||
        line.indexOf('8.') >= 0 ||
        line.indexOf('9.') >= 0 ||
        line.indexOf('0.') >= 0)
    );
  };

  static readHexMap = () => {
    let lineCount = 0;
    let chapterCount = 0;
    let title = null;
    let chapterNumbers = {};

    return new Promise((res, rej) => {
      Documents.readLines(line => {
        if (line === null) {
          let upper = title.split('(')[1].split(' ')[0];
          let lower = title.split('(')[1].split(' ')[2].split(')')[0];
          lower = Elements[lower];
          upper = Elements[upper];
          let hexKey = lower.join('') + upper.join('');
          chapterNumbers[hexKey] = chapterCount;
          res(chapterNumbers);
        }

        lineCount++;
        if (lineCount < 118) {
          return;
        }

        if (Documents.isTitle(line)) {
          if (chapterCount > 0) {
            let upper = title.split('(')[1].split(' ')[0];
            let lower = title.split('(')[1].split(' ')[2].split(')')[0];
            lower = Elements[lower];
            upper = Elements[upper];
            let hexKey = lower.join('') + upper.join('');
            chapterNumbers[hexKey] = chapterCount;
          }
          chapterCount++;
          title = line;
        }
      }, rej);
    });
  };

  static readTitles = () => {
    let lineCount = 0;
    let chapterCount = 0;
    let title = null;
    let titles = [];
    return new Promise((res, rej) => {
      Documents.readLines(line => {
        if (line === null) {
          let num = chapterCount;
          title = title.split('(')[0].slice(0, -1);
          titles.push({num, title});
          res(titles);
        }

        lineCount++;
        if (lineCount < 118) {
          return;
        }

        if (Documents.isTitle(line)) {
          if (chapterCount > 0) {
            let num = chapterCount;
            title = title.split('(')[0].slice(0, -1);
            titles.push({num, title});
          }
          chapterCount++;
          title = line;
        }
      }, rej);
    });
  };

  static readChapter = number => {
    let lineCount = 0;
    let chapterCount = 0;
    let title = null;
    let paragraphs = '';
    let resolved = false;
    return new Promise((res, rej) => {
      Documents.readLines(line => {
        if (line === null && !resolved) {
          let num = chapterCount;
          let upper = title.split('(')[1].split(' ')[0];
          let lower = title.split('(')[1].split(' ')[2].split(')')[0];
          // eslint-disable-next-line prettier/prettier
          let sentanceOne = (paragraphs.split(', it is important to')[0] + ', it is important to').substr(1);
          paragraphs = paragraphs.split(', it is important to')[1];
          paragraphs = paragraphs.split('\n\n').join('\n');
          title = title.split('(')[0].slice(0, -1);
          res({num, title, upper, lower, sentanceOne, paragraphs});
        }

        lineCount++;
        if (lineCount < 118) {
          return;
        }

        if (Documents.isTitle(line)) {
          if (chapterCount === number) {
            let num = chapterCount;
            let upper = title.split('(')[1].split(' ')[0];
            let lower = title.split('(')[1].split(' ')[2].split(')')[0];
            // eslint-disable-next-line prettier/prettier
            let sentanceOne = (paragraphs.split(', it is important to')[0] + ', it is important to').substr(1);
            paragraphs = paragraphs.split(', it is important to')[1];
            paragraphs = paragraphs.split('\n\n').join('\n');
            title = title.split('(')[0].slice(0, -1);
            resolved = true;
            res({num, title, upper, lower, sentanceOne, paragraphs});
          }
          chapterCount++;
          title = line;
          paragraphs = '';
        } else {
          paragraphs += `${line}\n`;
        }
      }, rej);
    });
  };
}
