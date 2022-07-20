import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {styles} from './styles';
import {addMsgChat} from '../../redux/reducers/chatReducer';

const InputBar = () => {
  const dispatch = useDispatch();
  const db = openDatabase({
    name: 'rn_chat_sqlite',
  });
  const [microphoneState, useMicrophoneState] = useState(false);
  const [inputValue, setValue] = useState('');
  const ownerID = useSelector(state => state.chat.ownerID);

  const addCategory = (userId, title) => {
    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO chats (title, userId) VALUES (?, ?)`,
        [title, userId],
        (sqlTxn, res) => {
          console.log(`${title} category added successfully`);
          dispatch(addMsgChat({userId: userId, title: title}));
        },
        error => {
          console.log('error on adding category ' + error.message);
        },
      );
    });
  };

  useEffect(() => {
    handleEnableMicrophonePress();
  }, [false]);

  const handleOnChange = value => {
    setValue(value);
  };

  const handleOnSend = () => {
    if (inputValue) {
      addCategory(ownerID, inputValue);
    }
    setValue('');
  };

  const handleEnableMicrophonePress = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Enable Microphone?',
            message:
              'Microphone will be used to record audio',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          useMicrophoneState(true);
          console.log('Microphone on');
        } else {
          useMicrophoneState(false);
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      const microphoneUse = await check(PERMISSIONS.IOS.MICROPHONE);

      if (microphoneUse === RESULTS.GRANTED) {
        useMicrophoneState(true);
        console.log('Microphone on');
      } else {
        const microphoneUseStatusRequest = await request(
          PERMISSIONS.IOS.MICROPHONE,
        );
        if (microphoneUseStatusRequest === RESULTS.GRANTED) {
          useMicrophoneState(true);
          console.log('Microphone on');
        } else {
          console.log('Error');
          useMicrophoneState(false);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.inputBarView}>
        <TextInput
          style={styles.textInput}
          placeholder="Message..."
          onChangeText={handleOnChange}
          value={inputValue}
        />

        <TouchableOpacity onPress={() => {}}>
          <FAIcon
            style={{paddingHorizontal: 5}}
            name="microphone"
            size={30}
            color={microphoneState ? '#00b11d' : '#9f9f9f'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOnSend}>
          <Icon
            style={{paddingHorizontal: 5}}
            name="send"
            size={30}
            color="#000000"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InputBar;
