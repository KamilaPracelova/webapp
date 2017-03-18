angular.module('storyController', ['storyServices'])

.controller('savestoryCtrl', function($http, $location, Story) {
  
  var app = this; // successMsg can be accessed outside the scope

 // do something

  this.saveStory = function(storyData) {
    app.errorMsg = false; // nezobrazuje errorMsg na stranke
    console.log(this.storyData);
    Story.create(app.storyData).then(function(data) {
      console.log(data.data.success);
      console.log(data.data.message);
        if (data.data.success){
          app.successMsg = data.data.message;
          $location.path('/createstory');
        } else {
          app.errorMsg = data.data.message;
        }
      });
  };
})



.controller('storyCtrl', function(Story, $scope, $http, $location) {

var app = this;
function getStories() {
  Story.getStories().then(function(data){
      if (data.data.success) {
        app.stories = data.data.stories;
        console.log(data);
      }
  });
}
getStories()
})

.controller('editStoryCtrl', function(Story, $routeParams) {
      var app = this;
      Story.editStory($routeParams.id).then(function(data) {
            console.log(data);
        })
})

.controller('showStoryCtrl', function(Story, $scope, $routeParams) {

var app = this;

Story.getStory($routeParams.id).then(function(data) {
    if (data.data.success) {
      console.log($routeParams.id);
      console.log(data);
    } 
     else {
          console.log('fuck');
         }
    });
});
