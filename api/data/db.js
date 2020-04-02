const mongoose = require('mongoose');

const dburl = "mongodb://localhost:27017/chatapp";

mongoose.connect(dburl, { useUnifiedTopology: true , useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('mongoose connected on ' +dburl);
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
    console.log('error' +err);
});