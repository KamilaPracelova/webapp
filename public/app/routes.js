var app = angular.module('appRoutes', ['ngRoute'])

    // Configure Routes; 'authenticated = true' means the user must be logged in to access the route
    .config(function ($routeProvider, $locationProvider) {

        // AngularJS Route Handler
        $routeProvider

            // Route: Home             
            .when('/addroom', {
                templateUrl: 'app/views/pages/stories/addroom.html',
                controller: 'addRoomCtrl',
                controllerAs: 'roomadd',
            })

            // Route: Home             
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

           .when('/x', {
                templateUrl: 'app/views/pages/x.html',
                controller: 'SearchCtrl',
            })


            // Route: Get all cultural objects
            .when('/searchobjects', {
                templateUrl: 'app/views/pages/objects/searchobjects.html',
                controller: 'allObjectCtrl',
                controllerAs: 'objectall'
            })


            // Route: About Us (for testing purposes)
            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })

            // Route: Create a cultural object
            .when('/createobject', {
                templateUrl: 'app/views/pages/objects/createobject.html',
                controller: 'createObjectCtrl',
                controllerAs: 'objectcreate',
                authenticated: true,
                permission: ['admin', 'moderator']
            })

            // Route: Get all cultural objects
            .when('/allobjects', {
                templateUrl: 'app/views/pages/objects/allobjects.html',
                controller: 'allObjectCtrl',
                controllerAs: 'objectall'
            })

            // Route: Get all cultural objects
            .when('/likedobjects', {
                templateUrl: 'app/views/pages/objects/likedobjects.html',
                controller: 'allObjectCtrl',
                controllerAs: 'objectall'
            })

            // Route: Get all cultural objects
            .when('/allobjectsbycreators', {
                templateUrl: 'app/views/pages/objects/allobjectsbycreators.html',
                controller: 'allObjectsByCreatorsCtrl',
                controllerAs: 'objecbycreatorall'
            })

                        // Route: Get all cultural objects
            .when('/allobjectsbycreator', {
                templateUrl: 'app/views/pages/objects/allobjectsbycreator.html',
                controller: 'allObjectsByCreatorCtrl',
                controllerAs: 'objectbycreator'
            })

                                    // Route: Get all cultural objects
            .when('/w', {
                templateUrl: 'app/views/pages/objects/w.html',
                controller: 'allObjectCtrl',
            })

            // Route: Get one cultural object
            .when('/object/:id', {
                templateUrl: 'app/views/pages/objects/object.html',
                controller: 'showObjectCtrl',
                controllerAs: 'objectshow'
            })

            // Route: Get all object creators
            .when('/allcreators', {
                templateUrl: 'app/views/pages/objects/allcreators.html',
                controller: 'allCreatorCtrl',
                controllerAs: 'creatorall'
            })

            .when('/createstory', {
                templateUrl: 'app/views/pages/stories/createstory.html',
                controller: 'createStoryCtrl',
                controllerAs: 'storycreate',
                authenticated: true,
                permission: ['admin', 'moderator', 'user']
            })

             .when('/createdog', {
                templateUrl: 'app/views/pages/stories/createdog.html',
                controller: 'createDogCtrl',
                controllerAs: 'dogcreate',
                authenticated: true,
                permission: ['admin', 'moderator', 'user']
            })


              .when('/createfriend', {
                templateUrl: 'app/views/pages/stories/createfriend.html',
                controller: 'createFriendCtrl',
                controllerAs: 'friendcreate',
                authenticated: true,
                permission: ['admin', 'moderator', 'user']
            })

            .when('/allstories', {
                templateUrl: 'app/views/pages/stories/allstories.html',
                controller: 'allStoryCtrl',
                controllerAs: 'storyall'
            })

            .when('/mystories', {
                templateUrl: 'app/views/pages/stories/mystories.html',
                controller: 'myStoriesCtrl',
                controllerAs: 'storyall'
            })

            // Route: About Us (for testing purposes)
            .when('/story/:id', {
                templateUrl: 'app/views/pages/stories/story.html',
                controller: 'showStoryCtrl',
                controllerAs: 'storyshow'
            })

            // adding images to stories
            .when('/story/:id/addImages', {
                templateUrl: 'app/views/pages/objects/addimages.html',
                controller: 'allObjectCtrl',
                controllerAs: 'objectall'
            })

            .when('/editstory/:id', {
                templateUrl: 'app/views/pages/stories/editstory.html',
                controller: 'editStoryCtrl',
                controllerAs: 'storyedit',
                //authenticated: true,
                //permission: ['admin', 'moderator']
            })

            // Route: User Registration
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })

            // Route: User Login
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })

            // Route: User Profile
            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                authenticated: true
            })

            // Route: Facebook Callback Result            
            .when('/facebook/:token', {
                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'facebookCtrl',
                controllerAs: 'facebook',
                authenticated: false
            })

            // Route: Twitter Callback Result
            .when('/twitter/:token', {
                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'twitterCtrl',
                controllerAs: 'twitter',
                authenticated: false
            })

            // Route: Google Callback Result
            .when('/google/:token', {
                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'twitterCtrl',
                controllerAs: 'twitter',
                authenticated: false
            })

            // Route: Facebook Error
            .when('/facebookerror', {
                templateUrl: 'app/views/pages/users/login.html',
                controller: 'facebookCtrl',
                controllerAs: 'facebook',
                authenticated: false
            })

            // Route: Twitter Error
            .when('/twittererror', {
                templateUrl: 'app/views/pages/users/login.html',
                controller: 'twitterCtrl',
                controllerAs: 'twitter',
                authenticated: false
            })

            // Route: Google Error
            .when('/googleerror', {
                templateUrl: 'app/views/pages/users/login.html',
                controller: 'googleCtrl',
                controllerAs: 'google',
                authenticated: false
            })

            // Route: Twitter Not Yet Activated Error
            .when('/twitter/unconfirmed/error', {
                templateUrl: 'app/views/pages/users/login.html',
                controller: 'twitterCtrl',
                controllerAs: 'twitter',
                authenticated: false
            })

            // Route: Manage User Accounts
            .when('/management', {
                templateUrl: 'app/views/pages/management/management.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
                authenticated: true,
                permission: ['admin']
            })


                        // Route: Manage User Accounts
            .when('/cat', {
                templateUrl: 'app/views/pages/management/cat.html',
                controller: 'catCtrl',
                controllerAs: 'cat',
                authenticated: true,
                permission: ['admin']
            })


            // Route: Edit a User
            .when('/edit/:id', {
                templateUrl: 'app/views/pages/management/edit.html',
                controller: 'editCtrl',
                controllerAs: 'edit',
                authenticated: true,
                permission: ['admin', 'moderator']
            })

            // Route: Search Database Users
            .when('/search', {
                templateUrl: 'app/views/pages/management/search.html',
                controller: 'managementCtrl',
                controllerAs: 'management',
                authenticated: true,
                permission: ['admin', 'moderator']
            })

            .otherwise({ redirectTo: '/' }); // If user tries to access any other route, redirect to home page

        $locationProvider.html5Mode({ enabled: true, requireBase: false }); // Required to remove AngularJS hash # from URL (no base is required in index file)
    });

// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {

    // Check each time route changes    
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        // Only perform if user visited a route listed above
        if (next.$$route !== undefined) {
            // Check if authentication is required on route
            if (next.$$route.authenticated === true) {
                // Check if authentication is required, then if permission is required
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); // If not logged in, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                } else if (next.$$route.permission) {
                    // Function: Get current user's permission to see if authorized on route
                    User.getPermission().then(function (data) {
                        // Check if user's permission matches at least one in the array
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                event.preventDefault(); // If at least one role does not match, prevent accessing route
                                $location.path('/'); // Redirect to home instead
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                // If authentication is not required, make sure is not logged in
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); // If user is logged in, prevent accessing route
                    $location.path('/profile'); // Redirect to profile instead
                }
            }
        }
    });
}]);
