import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {generateColor} from '../../utils/generateColor';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchChat,
  setChat,
} from '../../redux/reducers/chatReducer';

import {openDatabase} from 'react-native-sqlite-storage';

const ChatList = () => {
  const db = openDatabase({
    name: 'rn_chat_sqlite',
  });
  const chat = useSelector(state => state.chat.chatList);
  const ownerID = useSelector(state => state.chat.ownerID);
  const dispatch = useDispatch();
  const flatList = React.useRef(null);

  const clearTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        `DROP TABLE chats`,
        [],
        (sqlTxn, res) => {
          console.log(`Chats table cleared successfully`);
        },
        error => {
          console.log('error on clearing ' + error.message);
        },
      );
    });
  };

  const renderMessage = ({item}) => {
    const isOwner = Number(item.userId) === ownerID;

    return (
      <View style={[styles.messageBlock, isOwner && styles.ownerMessageBlock]}>
        {!isOwner && (
          <Text style={{color: generateColor(item.userId), fontWeight: 'bold'}}>
            {item.userId}
          </Text>
        )}
        <Text style={styles.messageText}>{item.title}</Text>
      </View>
    );
  };

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, title MEDIUMTEXT, userId INTEGER)`,
        [],
        (sqlTxn, res) => {
          console.log('table created successfully');
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };


  const getCategories = () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM chats ORDER BY id ASC`,
        [],
        (sqlTxn, res) => {
          console.log('categories retrieved successfully');
          let len = res.rows.length;

          if (len > 0) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({
                id: item.id,
                title: item.title,
                userId: item.userId,
              });
            }
            dispatch(setChat(results));
          } else {
            dispatch(fetchChat());
          }
        },
        error => {
          console.log('error on getting categories ' + error.message);
        },
      );
    });
  };

  useEffect(() => {
    async function fetchData() {
      await createTables();
      await getCategories();
    }
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.chatWrapperView}>
        <FlatList
          ref={flatList}
          onContentSizeChange={() => flatList.current.scrollToEnd()}
          data={chat}
          renderItem={renderMessage}
          key={item => item.id}
        />
        {/* <TouchableOpacity onPress={clearTable}>
          <Text>Clear</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default ChatList;
