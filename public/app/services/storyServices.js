angular.module('storyServices', [])

    .factory('Story', function ($http) {
        var storyFactory = {}; // Create the storyFactory object

        // Register story in database
        storyFactory.createStory = function (storyData) {
            return $http.post('/api/createstory', storyData);
        };

        storyFactory.editStory = function(storyData) {
            return $http.post('/api/editstory', storyData);
        };

                // Register story in database
        storyFactory.createDog = function (dogData) {
            return $http.post('/api/createdog', dogData);
        };


        // Get all the stories from database
        storyFactory.getAllStories = function () {
            return $http.get('/api/allstories/');
        };

        // Edit a story
        storyFactory.getStory = function (id) {
            return $http.get('/api/story/' + id);
        };

        return storyFactory; // Return storyFactory object
    });