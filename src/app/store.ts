import { configureStore } from "@reduxjs/toolkit";

import userSlice from "@/pages/login/slice";
import appSlice from "./appSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
