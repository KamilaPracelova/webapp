angular.module('storyController', ['storyServices'])

  .controller('createStoryCtrl', function ($http, $location, Story, User) {

    var app = this; // successMsg can be accessed outside the scope

    // do something

    this.createStory = function (storyData) {
      app.errorMsg = false; // nezobrazuje errorMsg na stranke
      console.log(this.storyData);
      Story.createStory(app.storyData).then(function (data) {
        console.log(data.data.success);
        console.log(data.data.message);
        if (data.data.success) {
          app.successMsg = data.data.message;
          $location.path('/createstory');
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  })


  .controller('allStoryCtrl', function (Story, $scope, $http, $location) {

    var app = this;
    function getAllStories() {
      Story.getAllStories().then(function (data) {
        if (data.data.success) {
          app.stories = data.data.stories;
          console.log(data);
        }
      });
    }
    getAllStories()
  })

  .controller('showStoryCtrl', function (Story, $scope, $routeParams) {

    var app = this;

    Story.getStory($routeParams.id).then(function (data) {
      if (data.data.success) {
        console.log($routeParams.id);
        console.log(data);
        $scope.storyTitle = data.data.story.story_title;
        $scope.storySubtitle = data.data.story.story_subtitle;
        $scope.storyDescription = data.data.story.story_description;
        $scope.storyTitleImage = data.data.story.story_title_image;
      }
      else {
        console.log('fuck');
      }
    })
  })

  .controller('editStoryCtrl', function (Story, $routeParams) {
    var app = this;
    Story.editStory($routeParams.id).then(function (data) {
      console.log(data);
    })
  });
