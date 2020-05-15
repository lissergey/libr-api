const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createDate: String,
    updateDate: String
});

module.exports = mongoose.model('Message', messageSchema);