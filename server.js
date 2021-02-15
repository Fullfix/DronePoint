// Express Authentication project by Fullfix 
// Create and put your SECRET_KEY and MongoAtlas DB_CONNECTION in .env file

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const fs = require('fs');

const auth = require('./routes/auth');
const order = require('./routes/order');
const dronepoint = require('./routes/dronepoint');

const passport = require('./config/passport');
const DronePoint = require('./models/DronePoint');
const Order = require('./models/Order');
const Drone = require('./models/Drone');
require('dotenv/config');

const app = express();
const port = process.env.PORT || 2000;
const credentials = {
    key: fs.readFileSync('server.key', 'utf8'),
    cert: fs.readFileSync('server.crt', 'utf8'),
}

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ 
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/api/auth', auth);
app.use('/api/order', order);
app.use('/api/dronepoint', dronepoint);

// handling response
app.use('/api/*', (req, res) => {
    console.log('end');
    console.log(res.data);
    if (!res.data) {
        return res.status(404).send({
            ok: false,
            error: {
                reason: 'Invalid Endpoint',
                code: 404
            }
        });
    };
    if (res.data.err) {
        return res.status(res.data.status || 400).send({
            status: false,
            error: {
                reason: res.data.err,
                code: res.data.status || 400
            }
        });
    };
    return res.status(res.data.status || 200).send({
        ok: true,
        response: res.data
    })
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => { 
    return res.sendFile(path.join(__dirname, 'client/build/index.html'));  
});

const httpsServer = https.createServer(app, credentials);

if (process.env.PROD) {
    httpsServer.listen(80);
} else {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

mongoose.connect(
    process.env.DB_CONNECTION,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => console.log(err ? err.message : 'Connected to Database')
);

// const initDP = async () => {
//     await DronePoint.updateMany({}, { $set: { shelf: new Array(20) }})
// }

// initDP()