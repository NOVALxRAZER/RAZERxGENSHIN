import axios from "axios";

const BASE_URL = process.env.REACT_APP_API;
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjhlOGEwMWI3YjA0YjdkMzk3NGQ0ZCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzODc4ODE1MiwiZXhwIjoxNjM5MjIwMTUyfQ.zyF3wy4xGnlaK-X_-xwyjvb5DOA25DTFaev2CuKMM8M"
// const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;

export const userRequest = axios.create({
    baseURL: BASE_URL,
});

export const baseURL = BASE_URL;

// export const adminRequest = axios.create({
//     baseURL: BASE_URL,
//     headers: { token: `Bearer ${TOKEN}` },
// });