const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const interestSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model('Interest', interestSchema);
