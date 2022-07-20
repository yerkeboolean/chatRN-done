import {all} from 'redux-saga/effects';
import {chatWatcher} from './chatSaga';

export function* rootWatcher() {
  yield all([chatWatcher()]);
}
