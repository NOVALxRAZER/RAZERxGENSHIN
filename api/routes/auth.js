const router = require("express").Router();
const User = require("../models/User")
const passport = require("passport")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//Google
router.get("/login/success", (req, res) => {
    let reqUser = req.user;
    try {
        if (reqUser) {
            const accessToken = jwt.sign({
                id: reqUser.googleId,
                isAdmin: reqUser.isAdmin,
                userType: 2,
            },
                process.env.JWT_SEC,
                { expiresIn: "1d" }
            );
            // console.log(req.params.id, "req user")
            // console.log(req.user.id, "user id")
            return res.status(200).json({
                success: true,
                message: "successfull",
                user: { ...reqUser._doc, accessToken },
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failed login",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(`http://151.106.120.124/login`);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login/failed" }),
    (req, res) => {
        res.redirect("http://151.106.120.124/");
    }
);

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Username");
        console.log(user, 'ini login auth')
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const pass = hashedPassword.toString(CryptoJS.enc.Utf8);
        pass !== req.body.password && res.status(401).json("Wrong Password");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
            userType: 1,
        },
            process.env.JWT_SEC,
            { expiresIn: "1d" }
        );
        // console.log(req.params.id, "params id")
        // console.log(req.user, "ini")
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
    } catch (err) {
        return res.status(500).json(err);
    }
})


module.exports = router