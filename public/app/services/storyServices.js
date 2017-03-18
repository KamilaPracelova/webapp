angular.module('storyServices', [])

.factory('Story', function($http) {
    var storyFactory = {}; // Create the userFactory object

        // Register story in database
    storyFactory.create = function(storyData) {
        return $http.post('/api/createstory', storyData);
    };
    
            // Get all the users from database
    storyFactory.getStories = function() {
        return $http.get('/api/allstories/');
    };

        // Edit a user
    storyFactory.editStory = function(id) {
        return $http.get('/api/editstory/', + id);
    };

        // Edit a user
    storyFactory.getStory = function(id) {
       return $http.get('/api/story/', + id);
   };

    return storyFactory; // Return userFactory object
});