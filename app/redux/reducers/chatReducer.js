import {openDatabase} from 'react-native-sqlite-storage';

const defaultState = {
  chatList: [],
  ownerID: 1,
};

export const SET_CHAT = 'SET_CHAT';
export const SET_CHAT_TO_DB = 'SET_CHAT_TO_DB';
export const ADD_MSG = 'ADD_MSG';
export const FETCH_CHAT = 'FETCH_CHAT';

export default function chatReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_CHAT: {
      return {...state, chatList: action.payload};
    }
    case SET_CHAT_TO_DB: {
      const newArr = action.payload.map(item => {
        db.transaction(txn => {
          txn.executeSql(
            `INSERT INTO chats (title, userId) VALUES (?, ?)`,
            [item.title, item.userId],
            (sqlTxn, res) => {
              console.log('Success');
            },
            error => {
              console.log('error on adding category ' + error.message);
            },
          );
        });
      });
    }
    case ADD_MSG: {
      const prevListChat = state.chatList;
      prevListChat.push(action.payload);
      return {...state, chatList: prevListChat};
    }
  }
  return state;
}

export const setChat = payload => ({type: SET_CHAT, payload});
export const setChatToDB = payload => ({type: SET_CHAT_TO_DB, payload});
export const addMsgChat = payload => ({type: ADD_MSG, payload});
export const fetchChat = () => ({type: FETCH_CHAT});

