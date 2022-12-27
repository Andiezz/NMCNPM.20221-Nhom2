const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const citizenSchema = new Schema({
    card_id: {
        type: String,
        required: true,
    },
    household_id: {
        type: String,
    },
    passport_id: {
        type: String,
        required: true,
    },
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
        require: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    birthPlace: {
        type: String,
        required: true,
    },
    hometown: {
        type: String,
        required: true,
    },
    residence: {
        type: String,
        required: true,
    },
    religion: {
        type: String,
        required: true,
    },
    ethic: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    workplace: {
        type: String,
        required: true,
    },
    education: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Citizen', citizenSchema);
