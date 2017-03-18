var app = angular.module('appRoutes', ['ngRoute'])

// Configure Routes; 'authenticated = true' means the user must be logged in to access the route
.config(function($routeProvider, $locationProvider) {

    // AngularJS Route Handler
    $routeProvider

    // Route: Home             
        .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    // Route: About Us (for testing purposes)
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })

        // Route: About Us (for testing purposes)
    .when('/story/:id', {
       templateUrl: 'app/views/pages/story.html',
       controller: 'showStoryCtrl',
       controllerAs: 'storyshow'
    })   

        .when('/editstory/:id', {
        templateUrl: 'app/views/pages/editstory.html',
        controller: 'editStoryCtrl',
        controllerAs: 'storyedit',
        //authenticated: true,
        //permission: ['admin', 'moderator']
    })   

    // Route: About Us (for testing purposes)
    .when('/story2', {
        templateUrl: 'app/views/pages/story2.html',
        controller: 'storyCtrl',
        controllerAs: 'storyall'
    })

        .when('/allstories', {
        templateUrl: 'app/views/pages/allstories.html',
        controller: 'storyCtrl',
        controllerAs: 'storyall'
    })
    
        .when('/createstory', {
        templateUrl: 'app/views/pages/createstory.html',
        controller: 'savestoryCtrl',
        controllerAs: 'creating'
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
        permission: ['admin', 'moderator']
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
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

    // Check each time route changes    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {

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
                    User.getPermission().then(function(data) {
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
