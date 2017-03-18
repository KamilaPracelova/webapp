var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin
var User = require('../models/user'); // Import User Model
//var ObjectId = Schema.ObjectId;
var UserSchema = require('../models/user').schema
var User = require('../models/user').model



var StorySchema = new Schema({
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    //_creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator  : { type : Schema.Types.ObjectId , ref: 'User' }
    //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model('Story', StorySchema); // Export User Model for us in API
