import {put, takeEvery, call} from "redux-saga/effects"
import {FETCH_CHAT, setChat, setChatToDB} from "../reducers/chatReducer";

const fetchChatFromApi = () => fetch('https://jsonplaceholder.typicode.com/todos?_limit=30')

function* fetchChatWorker() {
    const data = yield call(fetchChatFromApi)
    const json = yield call(() => new Promise(res => res(data.json())))
    yield put(setChatToDB(json))
    yield put(setChat(json));
}

export function* chatWatcher() {
    yield takeEvery(FETCH_CHAT, fetchChatWorker)
}