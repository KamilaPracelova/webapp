 angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'managementController', 'storyController', 'storyServices', 'objectController', 'objectServices'])
//angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'managementController', 'storyController', 'storyServices', 'objectController', 'objectServices', 'addCtrl', 'gservice', 'geolocation'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
