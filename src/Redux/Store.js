import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserReducer";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
// import rootReduser from './reducers'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import ProjectReducer from "./ProjectReducer";

const persistConfig = {
  key: "user",
  storage,
};

const reducers = combineReducers({
  user: UserReducer,
  project: ProjectReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
