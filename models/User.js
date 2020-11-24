const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        required: [true, 'cannot be blank'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'cannot be blank']
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);