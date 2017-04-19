var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin

var StorySchema = new Schema({
	user_id: { type: String },
    story_title: { type: String },
    story_subtitle: { type: String },
    story_description: { type: String },
    story_title_image: { type: String },
    story_images: []
});

module.exports = mongoose.model('Story', StorySchema); // Export User Model for us in API
