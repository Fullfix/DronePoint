const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'is invalid'],
        required: [true, 'cannot be blank'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'cannot be blank']
    },
    icon: {
        type: Number,
        required: [true, 'cannot be blank'],
        default: 1,
    },
    active: {
        type: Boolean,
        default: false,
    },
    verificationString: {
        type: String,
        default: uuid.v4(),
    },
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);