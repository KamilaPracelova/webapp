angular.module('storyController', ['storyServices', 'userServices'])

  .controller('createStoryCtrl', function ($http, $location, Story, User) {

    var app = this; // successMsg can be accessed outside the scope

    // do something

    this.createStory = function (storyData) {
      app.errorMsg = false; // nezobrazuje errorMsg na stranke
      Story.createStory(app.storyData).then(function (data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $location.path('/createstory');
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  })


  .controller('allStoryCtrl', function (Story, $scope, $http, $location, User) {
    var app = this;

    function getAllStories() {
        // get the stories for a user
        Story.getAllStories().then(function(response) {
          console.log(response.data);

          if (response.data.success) {
            app.stories = response.data.stories;
          }
        });
    }

    getAllStories();
  })

  .controller('myStoriesCtrl', function(Story, $scope, $http, $location, User) {
    var app = this;

    function getAllStoriesForUser() {
        // get the stories for a user
        Story.getAllStoriesForUser().then(function(response) {
          if (response.data.success) {
            app.stories = response.data.stories;
          }
        });
    }

    getAllStoriesForUser();
  })

  .controller('showStoryCtrl', function (Story, $scope, $routeParams) {

    var app = this;

    Story.getStory($routeParams.id).then(function (data) {
      if (data.data.success) {
        let story = data.data.story;

        $scope.storyTitle = story.story_title;
        $scope.storySubtitle = story.story_subtitle;
        $scope.storyDescription = story.story_description;
        $scope.storyTitleImage = story.story_title_image;
        $scope.storyId = story._id;
        $scope.images = story.story_images;
      }
      else {
        console.log('fuck'); // rofl xD
      }
    })
  })

  .controller('editStoryCtrl', function (Story, $routeParams) {
    var app = this;
    Story.editStory($routeParams.id).then(function (data) {
      console.log(data);
    })
  });
