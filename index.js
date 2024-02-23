// import core modules
const express = require('express');
const mongoose = require('mongoose');

// import files

// app instance
const app = express();

// middlewares
app.use(express.json())

//database
mongoose.connect("mongodb://127.0.0.1:27017/makapi")

    .then(() => {
        console.log("connection has been established.");
    })
    .catch(err => {
        console.log(err);
    })
// routes
const adminRoutes = require('./routes/backend/root.route');

app.use('/admin', adminRoutes);

// authentication route
const frontendRoute = require('./routes/frontend/root.route');

app.use(frontendRoute);

// PORT
let PORT = process.env.PORT || 8000;

// server listen
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})