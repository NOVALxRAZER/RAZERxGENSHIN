const express = require("express")
const app = express();
const mongoose = require("mongoose")
const passport = require("passport")
const dotenv = require("dotenv")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const productRouter = require("./routes/product")
const cartRouter = require("./routes/cart")
const orderRouter = require("./routes/order")
const stripeRouter = require("./routes/stripe")
const cors = require("cors")

//Dotenv Confid
dotenv.config();

//Passport Config
require("./passport")(passport);

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
});

//Express Framework
app.use(express.json());

//Session
app.use(session({
    secret: process.env.PASS_SEC_SESS,
    maxAge: 24 * 60 * 60 * 100,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//CORS Whitelist
let whitelist = [
    `http://151.106.120.124/`,
];

// let corsOptions = {
//     origin: (origin, callback) => {
//         if (origin === undefined || whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         }
//         else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
// }

//CORS
app.use(cors({
    origin: whitelist,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
}))

//Routers
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/checkout", stripeRouter);

//Port & Server Running
app.listen(8500, () => {
    console.log("Server is Up and Running");
})