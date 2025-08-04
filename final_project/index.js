const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session and token exist
    if (!req.session || !req.session.token) {
        return res.status(403).json({ message: "User not logged in. Access denied." });
    }

    // Verify token
    jwt.verify(req.session.token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token. Access denied." });
        }
        // Attach decoded user info to request
        req.user = user;
        next();
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
