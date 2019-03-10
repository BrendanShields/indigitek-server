// Mongoose allows us to write Models from our Code.
// To alter the database structure you can update the model.
// However there can be risks associated as updated queries may render
// null on existing data when retrieving.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);

// Schema based solution to model app data, creating key value pairs for different data types. 