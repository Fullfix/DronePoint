// Express Authentication project by Fullfix 
// Create and put your SECRET_KEY and MongoAtlas DB_CONNECTION in .env file

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

const auth = require('./routes/auth');
const order = require('./routes/order');

const passport = require('./config/passport');
require('dotenv/config');

const app = express();
const port = process.env.PORT || 2000;

app.get('/', (req, res) => res.send('Hello World!'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: process.env.SECRET_KEY }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/auth', auth);
app.use('/order', order);

// handling response
app.use((req, res) => {
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

app.listen(port, () => console.log(`Listening on port ${port}`));

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => console.log(err ? err.message : 'Connected to Database')
);