import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjhlOGEwMWI3YjA0YjdkMzk3NGQ0ZCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzOTM2ODEwNywiZXhwIjoxNjQxOTYwMTA3fQ.8SlJYvEcWyljwdR3HwJyAbaIcCKgAJ0rxOQ6zIJeEwI"
// const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;

export const userRequest = axios.create({
    baseURL: BASE_URL,
});

// export const userRequest = axios.create({
//     baseURL: BASE_URL,
//     headers: { token: `Bearer ${TOKEN}` },
// });