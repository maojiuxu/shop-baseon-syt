import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { reqLogin, reqGetUserInfo, reqLogout } from "@api/user";

export interface LoginParams {
  username: string;
  password: string;
}

// 1. 定义初始化状态
const initialState = {
  // 应该从localStorage中读取token数据，有就用，没有空串
  token: localStorage.getItem("token") || "", // 用户唯一标识
  name: "", // 用户名
  avatar: "", // 用户头像
};

// 异步action
// 登录
export const loginAsync = createAsyncThunk(
  "user/loginAsync", 
  ({ username, password }: LoginParams) => reqLogin(username, password)
);
// 获取用户信息
export const getUserInfoAsync = createAsyncThunk(
  "user/getUserInfoAsync", 
  () => reqGetUserInfo()
);
// 登出
export const logoutAsync = createAsyncThunk(
  "user/logoutAsync", 
  () => reqLogout()
);

// 2. 创建redux模块
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        // action.payload就是上一步结果值
        const token = action.payload;
        // 将token存储在redux中
        state.token = token;
        // 将token存储在localStorage中
        localStorage.setItem("token", token);
      })
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        // action.payload就是上一步结果值
        const { name, avatar } = action.payload ;
        state.name = name;
        state.avatar = avatar;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.token = "";
        state.name = "";
        state.avatar = "";
        localStorage.removeItem("token");
      }),
});

// 3. 将redux模块的reducer函数暴露出去，汇总
export default userSlice.reducer;

// 向外暴露用于读取当前模块的状态数据的select函数
export const selectUser = (state: RootState) => state.user;