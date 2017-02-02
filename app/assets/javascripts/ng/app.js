var _ = window.Lodash
var pins = angular.module('pins', ['ui.router', 'Devise', 'restangular'])

pins.constant('_', _)

pins.config(
  ["$httpProvider",
  function($httpProvider) {
    var token = angular.element('meta[name=csrf-token]')
      .attr('content');
    $httpProvider
      .defaults
      .headers
      .common['X-CSRF-Token'] = token;
  }]);

pins.config(['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.setBaseUrl("/api/v1");
  RestangularProvider.setRequestSuffix('.json');
  RestangularProvider.setDefaultHttpFields({
    'content-type' : 'application/json'
  });
}]);

pins.config(['AuthProvider', function(AuthProvider) {
  AuthProvider.loginPath('/users/sign_in.json');
  AuthProvider.loginMethod('POST');
  AuthProvider.resourceName('users');
}]);

pins.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/pins');

    $stateProvider
      .state('main', {
        abstract: true,
        templateUrl: '/templates/main/index.html',
        url: "/"
      })
      .state('pins', {
        parent: 'main',
        abstract: true,
        url: 'pins',
        views: {
          'pins' : {
            template: "<ui-view></ui-view>"
          },
          'user' : {
            templateUrl: '/templates/user.html',
            controller: 'UserCtrl'
          }
        }
      })
      .state('pinsIndex', {
        url: '',
        resolve: {
          'pins' : ['pinService', (pinService) => {
            console.log('resolving')
            return pinService.get();
          }]
        },
        views: {
          '' : {
            templateUrl: 'templates/pins/index.html',
            controller: 'PinsIndexCtrl'
          }
        }
      })
      .state('user', {
        parent: 'main',

      })
      .state('show', {
        parent: 'pin'
        // show template
      })
  }]);
