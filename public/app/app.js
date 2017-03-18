angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'managementController', 'storyController', 'storyServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
