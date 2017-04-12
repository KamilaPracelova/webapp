 angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'managementController', 'storyController', 'storyServices', 'objectController', 'objectServices', 'timeline'])
//angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'managementController', 'storyController', 'storyServices', 'objectController', 'objectServices', 'addCtrl', 'gservice', 'geolocation'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
