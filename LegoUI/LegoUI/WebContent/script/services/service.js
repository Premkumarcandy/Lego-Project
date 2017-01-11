legoApp.service("RESTAPI", ['$rootScope', function($rootScope) {
	this.url = function(apiName){
		switch(apiName){
		case 'validateLogin': return $rootScope.REST_API_FIXED_URL + '/users/validate'; break;
		case 'orderList': return $rootScope.REST_API_FIXED_URL + '/orders'; break;
		case 'orderDetails': return $rootScope.REST_API_FIXED_URL + '/orders'; break;
		case 'orderSearch': return $rootScope.REST_API_FIXED_URL + '/search'; break;
		case 'shippingdetails': return $rootScope.REST_API_FIXED_URL + '/shippingdetails'; break;
		case 'chartDetails': return $rootScope.REST_API_FIXED_URL + '/getStatistics'; break;
		case 'updateorder': return $rootScope.REST_API_FIXED_URL + '/updateorder'; break;
		
		default : console.log("no url"); break;
		}
	}
	this.REST_API_FIXED_URL = function(){
		return $rootScope.REST_API_FIXED_URL;
	}
	
}]);

legoApp.service("loginService", ['$http', '$rootScope', 'RESTAPI', function($http, $rootScope, RESTAPI) {
	this.validateUser = function(postData,callback){
		var postData = {
				  "userId": postData.userName,
				  "Password": postData.pwd
				}
		$http.post(RESTAPI.url('validateLogin'), postData).success(function(data){	
			callback(data);
		});
		/*var data = {"id":14,"rolesDto":{"roleId":4,"roleName":"WarehousEmp","attrName":"WarehouseCountry","attrValue":"billund"},"userId":"radhan","salt":"OzTeK9nIOjxfNPA1mE7eiOLnvzoCqmnR","hash":"dRej1bnm9NfjnmxMqG5zoLBn","lastLoginTime":"2016-11-28 00:00","createdTime":"2016-11-28 00:00","createdBy":"System","updatedTime":"2016-11-28 00:00","updatedBy":"System"};
		callback(data);*/
	}
}]);


legoApp.service("orderService", ['$http', '$rootScope', 'RESTAPI', function($http, $rootScope, RESTAPI) {
	this.getOrderlist = function(userRole, callback){		
		$http.get(RESTAPI.url('orderList') + '/'+ userRole.attrName + '/' + userRole.attrValue).success(function(data){	
			callback(data);
		});
		/*var data = [{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501078765,"status":"With Supplier","description":"Order Received by Supplier","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079222,"status":"Delivered","description":"Order is Delivered","expectedDeliveryDate":"2017-01-20 08:17"},{"orderId":4501079983,"status":"Shipped","description":"Order is Shipped","expectedDeliveryDate":"2017-01-20 08:17"}]
		callback(data);*/
	}
	
	this.getOrderBySeach = function(seachParam, callback){
		$http.get(RESTAPI.url('orderSearch') + '/' +seachParam).success(function(data){	
			callback(data);
		});
	}
}]);

legoApp.service("orderDetails", ['$http', '$rootScope', 'RESTAPI', function($http, $rootScope, RESTAPI) {
	this.getOrderDetails = function(orderId, callback){		
		$http.get(RESTAPI.url('orderDetails') + "/" + orderId).success(function(data){	
			callback(data);
		});
		/*var data = {"orderId":4501078765,"postatus":"With Supplier","updatedBy":"Supplieruserid","updatedDate":"2016-11-28 04:00","createdBy":"rep3@lego.com","createdDate":"2017-01-10 00:00","warehouseCity":"Mexico","supplierAddress1":"Addr1","supplierAddress2":"Add2","warehouseAddress1":"Addr1","warehouseAddress2":"Addr2","warehouseCountry":"billund","supplierId":121778,"supplierCity":"HongKong","supplierCountry":"HongKong","brokerId":"cus3","description":null,"poValue":1600.0,"statusdescription":"Order Received by Supplier","currency":"USD","expectedDeliveryDate":"2017-01-20 08:17","linedetailsesDto":[{"lineId":54,"createdAt":"2016-11-28 04:00","mouldNo":"596X44x638","artNo":4817008,"quantity":4,"status":"RECEIVEDBYSUPPLIER","lineDescription":"Airport Cargo Plane","unitPrice":332.0,"orderStatusesDto":[{"id":5,"orderId":4501078765,"lineId":54,"status":"Received","createdBy":"Supplieruserid","createdDate":"2016-11-27 08:00","attrName":"","attrValue":"","description":"Order Received by Supplier","expectedDeliveryDate":null},{"id":2,"orderId":4501078765,"lineId":54,"status":"Shipped","createdBy":"Supplieruserid","createdDate":"2016-11-28 04:00","attrName":"","attrValue":"","description":"Order is Shipped","expectedDeliveryDate":null},{"id":29342,"orderId":4501078765,"lineId":54,"status":"Cancelled","createdBy":"System","createdDate":"2017-01-10 20:30","attrName":"WarehouseCountry","attrValue":"billund","description":"cancelleing the order","expectedDeliveryDate":null},{"id":3,"orderId":4501078765,"lineId":54,"status":"Received","createdBy":"Customerbrokeruserid","createdDate":"2016-11-26 09:00","attrName":"","attrValue":"","description":"Order Received by Broker","expectedDeliveryDate":null},{"id":4,"orderId":4501078765,"lineId":54,"status":"Received","createdBy":"Warehouseuserid","createdDate":"2016-11-28 00:06","attrName":"","attrValue":"","description":"Order Received at WareHouse","expectedDeliveryDate":null},{"id":29339,"orderId":4501078765,"lineId":54,"status":"Received","createdBy":"System","createdDate":"2017-01-10 20:19","attrName":"WarehouseCountry","attrValue":"billund","description":"testing update functionality","expectedDeliveryDate":null},{"id":29346,"orderId":4501078765,"lineId":54,"status":"Received","createdBy":"System","createdDate":"2017-01-10 23:00","attrName":"WarehouseCountry","attrValue":"billund","description":"test","expectedDeliveryDate":null},{"id":29341,"orderId":4501078765,"lineId":54,"status":"Partial receipt","createdBy":"System","createdDate":"2017-01-10 20:22","attrName":"WarehouseCountry","attrValue":"billund","description":"asdasd","expectedDeliveryDate":null},{"id":29340,"orderId":4501078765,"lineId":54,"status":"Cancelled","createdBy":"System","createdDate":"2017-01-10 20:21","attrName":"WarehouseCountry","attrValue":"billund","description":"Cancelling order","expectedDeliveryDate":null},{"id":29348,"orderId":4501078765,"lineId":54,"status":"Received","createdBy":"System","createdDate":"2017-01-10 23:05","attrName":"WarehouseCountry","attrValue":"billund","description":"Recived","expectedDeliveryDate":null},{"id":1,"orderId":4501078765,"lineId":54,"status":"Created","createdBy":"rep1@lego.com","createdDate":"2016-11-25 05:30","attrName":"","attrValue":"","description":"Order is Created","expectedDeliveryDate":null},{"id":29343,"orderId":4501078765,"lineId":54,"status":"Cancelled","createdBy":"System","createdDate":"2017-01-10 20:32","attrName":"WarehouseCountry","attrValue":"billund","description":"asdad","expectedDeliveryDate":null}]}]};
		callback(data);*/
	}
	
	this.getShippedDetails = function(orderId, callback){
		$http.get(RESTAPI.url('shippingdetails') + "/" + orderId).success(function(data){	
			callback(data);
		});
	}
}]);
legoApp.service("chartService", ['$http', '$rootScope', 'RESTAPI', function($http, $rootScope, RESTAPI) {
	this.getChartDetails = function(callback){		
		$http.get(RESTAPI.url('chartDetails')).success(function(data){	
			callback(data);
		});
		/*var data = [{"date":"Today","staticsDto":[{"status":"Onscheduled","count":31.0,"percentage":"100.00"},{"status":"Completed","count":0.0,"percentage":"0.00"},{"status":"Delayed","count":0.0,"percentage":"0.00"}]},{"date":"Weekly","staticsDto":[{"status":"Onscheduled","count":31.0,"percentage":"100.00"},{"status":"Completed","count":0.0,"percentage":"0.00"},{"status":"Delayed","count":0.0,"percentage":"0.00"}]},{"date":"Monthly","staticsDto":[{"status":"Onscheduled","count":29.0,"percentage":"93.55"},{"status":"Completed","count":1.0,"percentage":"3.23"},{"status":"Delayed","count":1.0,"percentage":"3.23"}]}];
		callback(data);*/
	}
}]);
legoApp.service("updateStatusService", ['$http', '$rootScope', 'RESTAPI', function($http, $rootScope, RESTAPI) {
	this.updateStatus = function(postData, callback){		
		$http.post(RESTAPI.url('updateorder'), postData).success(function(data){	
			callback(data);
		});
		/*var data = {"orderId":"4501079666","lineId":"32","shipmentTrackingId":null};
		callback(data);
		*/
	}
}]);
