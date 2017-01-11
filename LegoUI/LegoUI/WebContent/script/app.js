var legoApp = angular.module("legoApp", ["ngRoute", "ngLoadingSpinner", 'angular-loading-bar','ui.bootstrap']);
legoApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
    	templateUrl: 'views/login.html',
        controller: 'loginController'
    })
    .when("/login", {
    	templateUrl: 'views/login.html',
        controller: 'loginController'
    })
     .when("/order", {
    	templateUrl: 'views/order.html',
        controller: 'orderController'
    })
     .when("/status", {
    	templateUrl: 'views/status.html',
        controller: 'statusController'
    });
});
legoApp.run(['$rootScope','$http', function($rootScope, $http){
	//$rootScope.REST_API_FIXED_URL = 'http://10.117.214.122:8080/lego';
	$rootScope.REST_API_FIXED_URL = 'http://LP-PK2L2W2:4444';
}]);