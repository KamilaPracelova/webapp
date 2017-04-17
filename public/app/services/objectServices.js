angular.module('objectServices', [])

.factory('Object', function($http) {
    var objectFactory = {}; // Create the userFactory object

    // Create object in database
    objectFactory.createObject = function(objectData) {
        return $http.post('/api/createobject', objectData);
    };

    // Get all objects from database
    objectFactory.getAllObjects = function() {
        return $http.get('/api/allobjects/');
    };

    // // // Get all objects from database
    // objectFactory.getRelatedObjects = function(id) {
    //     return $http.get('/api/object/' + id);
    // };

    // Get one object from database
    objectFactory.getObject = function(id) {
       return $http.get('/api/object/' + id);
   };

//     // Get one object from database
//     objectFactory.getObjectsByCreator = function(creator) {
//        return $http.get('/api/allobjects/' + creator);
//    };


    // Get all objects from database
    objectFactory.getAllObjectsByCreators = function() {
        return $http.get('/api/allobjectsbycreators/');
    };

        // Get all objects from database
    objectFactory.getAllObjectsByCreator = function() {
        return $http.get('/api/allobjectsbycreator/');
    };

    // Get all object creators from database
    objectFactory.getCreators = function() {
        return $http.get('/api/allcreators/');
    };
    
    return objectFactory; // Return userFactory object
});