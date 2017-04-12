var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
//var ObjectId = Schema.ObjectId;

var ObjectSchema = new Schema({
    title: { type: String },
    creator: { type: String },
    subject: [String],
    description: { type: String },
    year: { type: String },
    period: { type: String },
    identifier: { type: String },
    authors_rights: { type: String },
    property_rights: { type: String },
    format: { type: String, default: 'MimeType' },
    classification: { type: String },
    work_type: { type: String },
    measurements: { type: String },
    materials: { type: String },
    techniques: { type: String },
    placement: { type: String },
    art_movement: { type: String },
    media_object: { type: String },
});

module.exports = mongoose.model('Object', ObjectSchema); // Export User Model for us in API
