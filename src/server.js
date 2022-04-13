import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ silent: true });
var app = express();

app.use('/client', express.static('./src/client'));

var server=app.listen((process.env.APP_LISTEN_PORT || 5000), () => {
    console.log("The WepApp is listening on: "+server.address().port);
});