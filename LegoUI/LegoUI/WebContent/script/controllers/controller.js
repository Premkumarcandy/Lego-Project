legoApp.controller("loginController", function($scope,$location,loginService, dataShare) {
	
	 $scope.submitForm = function(){
		 $scope.submitted = true;
		 if($scope.loginForm.$valid){
			 loginService.validateUser($scope.user, function(response) {
				  if(response.errorCode == null || typeof response.errorCode == undefined){
					  dataShare.setData({'loginDetails': response});				  
					  $location.path("\order");
				  }else{
					  $scope.errorMsg = response.errorMessage;
				  }
				
			 });
		 }
	 }
	 $scope.resetForm = function(){
		 $scope.user.userName = "";
		 $scope.user.pwd = "";
		 $scope.errorMsg = "";
		  $scope.display = "";
	 }
});


legoApp.controller("orderController", function($scope,$location,$modal,orderDetails,orderService, dataShare, chartService) {
	$scope.hideArrow = true;
	$scope.hideField = true;
	$scope.hideChart = true;
	getOrders();
	$scope.activeTab = 'Today';
	getStatistics('Today');
	$scope.setActiveTab = function(tabToSet) {
		$scope.activeTab = tabToSet;
		getStatistics(tabToSet);
	}
	
	function getStatistics(tabData){
		chartService.getChartDetails(function(response) {
			$scope.chartDetails = [];
			_.each(response, function(value, key){
				if(value.date === tabData){
					_.each(value.staticsDto, function(val, index){
						val.percentage = Math.round(val.percentage) + "%";
						//val.percentage = (val.percentage) + "%";
					});
					$scope.chartDetails.push(response[key].staticsDto);
				}				
			})
			console.log($scope.chartDetails[0]);
			$scope.chartDetails = $scope.chartDetails[0];
		});
	}

	$scope.openChart = function(){
		$scope.hideChart = ($scope.hideChart == true) ? false : true;
	};
	
	$scope.getPer = function(number){
		return Math.round(number);
	}
	if($(window).width() >= 375 && $(window).width() <= 767){
		$scope.showLeftPanel = true;
		$scope.showRightPanel = false;
	}else{
		$scope.selected = 0;
		$scope.showLeftPanel = true;
		$scope.showRightPanel = true;
	}
	$scope.populateDetails = function(orderDetails, index){
		$scope.selected = index;
		getOrderDetails(orderDetails, true);
	}
	
	function getOrderDetails(orderItem, isShow){
		$scope.orderItem = orderItem;
		$scope.isDone = false;
		if(isShow){
			if($(window).width() >= 375 && $(window).width() <= 767){
				$scope.showLeftPanel = false;
				$scope.showRightPanel = true;
				$scope.hideArrow = false;
			}
		}else{
			if($(window).width() >= 375 && $(window).width() <= 767){
				$scope.showLeftPanel = true;
				$scope.showRightPanel = false;
				$scope.hideArrow = false;
			}
		}
		
		orderDetails.getOrderDetails(orderItem.orderId, function(response) {
			response.linedetailsesDto[0].orderStatusesDto = response.linedetailsesDto[0].orderStatusesDto.sort(function(a, b){
				var a1 = a.id, b1=b.id;
				if( a1 == b1 ) return 0;
				return a1 > b1 ?  1 : -1;
			});
			
			angular.forEach(response.linedetailsesDto[0].orderStatusesDto, function(value, key) {
				if(value.createdDate){
					var dateTime = value.createdDate.split(" ");
					var dateFrmt = dateTime[0].split("-");
					var monthMap = {'01':'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'};
					response.linedetailsesDto[0].orderStatusesDto[key].month = monthMap[dateFrmt[1]];
					response.linedetailsesDto[0].orderStatusesDto[key].date = dateFrmt[2];
					response.linedetailsesDto[0].orderStatusesDto[key].time = dateTime[1];
				}
			});
			dataShare.setData({'updateData': response});
			$scope.orderData = response;
			
			
			$scope.isDone = true;
		});
	}
	
	$scope.getImage = function(status){
		//,"Received":{"img": "icon-status-green.png", "class":"dlverBrdStyle"}
		var imgStatusMap = {"Created": {"img": "icon-status-blue.png", "class":"ctrBrdStyle"},"Delivered":{"img": "icon-status-green.png", "class":"dlverBrdStyle"}, "Delayed": {"img": "icon-status-red.png", "class":"dlyedBrdStyle"}, "Completed": {"img": "icon-status-green.png", "class":"cmpldBrdStyle"},  "Cancelled": {"img": "icon-status-red.png", "class":"dlyedBrdStyle"}};
		return (imgStatusMap[status]) ? imgStatusMap[status].img : imgStatusMap["Created"].img;
	}
	$scope.getUserIcon = function(status){
		var imgStatusMap = {"Created": "icon-supplier.png","Delivered":"icon-warehouse.png", "Delayed": "icon-shipping.png", "Completed": "icon-warehouse.png"};
		return (imgStatusMap[status]) ? imgStatusMap[status] : imgStatusMap["Created"];
	}
	
	$scope.orderSearch = function(search){
		if(!_.isUndefined(search) && !_.isEmpty(search)){
			$scope.selected = 0;
			orderService.getOrderBySeach(search, function(response) {
				if(response[0].errorCode){
					openModal(response);
				}else{
					$scope.errorMsz = "";
					$scope.ordersList = response;
					getOrderDetails($scope.ordersList[0]);
				}
			});
		}else{
			getOrders();
		}
	}
	
	function getOrders(){
		var userRole = dataShare.getData('loginDetails').rolesDto;
		orderService.getOrderlist(userRole,function(response) {
			if(response[0].errorCode){
				//$scope.modalContent = response[0].errorMessage;
				openModal(response);
			}else{
				$scope.errorMsz = "";
				$scope.ordersList = response;
				getOrderDetails($scope.ordersList[0], false);
			}
			
		});
	}
	
	$scope.getHeightCls = function(row, index){
		var data = $scope.orderData.linedetailsesDto[0].orderStatusesDto;
		if(!_.isUndefined(row && data[index+1])){
			var duration = moment.duration(moment(data[index+1].createdDate).diff(moment(row.createdDate)));
			var days = Math.round(duration.asDays());
			var addClass = '';
			if(days <=2){
				addClass = 'less';
			}else if(days >2 && days < 5){
				addClass = 'medium';
			}else if(days >5 && days < 7){
				addClass = 'large';
			}else{
				addClass = 'Xlarge';
			}
			return row.status === "Delayed" ? addClass +" dlyedBrdStyle": addClass;
		}
	}
	
	$scope.updateStatus = function(updateData){
		var modalInstance = $modal.open({
            templateUrl : 'views/updateStatus.html',
            scope : $scope,
            controller: 'updateStatusCntrl' ,
        });
	}
	
	$scope.getShippedDetails = function(orderId){
		orderDetails.getShippedDetails(orderId, function(response){
			angular.forEach(response.trackingDetailsDto, function(value, key) {
				if(value.date){
					var dateTime = value.date.split(" ");
					var dateFrmt = dateTime[0].split("-");
					var monthMap = {'01':'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'};
					response.trackingDetailsDto[key].month = monthMap[dateFrmt[1]];
					response.trackingDetailsDto[key].date = dateFrmt[2];
					response.trackingDetailsDto[key].time = dateTime[1];
				}
			});
			$scope.shippedDetails = response;
			var modalInstance = $modal.open({
	            templateUrl : 'views/shippedDetails.html',
	            scope : $scope,
	            controller: 'shippedDetailsCntrl' ,
	        });
		});
	}
	
	$scope.displayList = function(){
		$scope.showLeftPanel = true;
		$scope.showRightPanel = false;
	}
	
	$scope.hideShow = function(){
		$scope.hideField = $scope.hideField === false ? true : false;
	}
	
	function openModal(errorRes){
		$scope.errorRes = errorRes;
		var modalInstance = $modal.open({
            templateUrl : 'views/error.html',
            scope : $scope,
            controller: 'updateStatusCntrl' ,
        });
	}
});
legoApp.controller("updateStatusCntrl", function($scope, $modalInstance,$modal, updateStatusService, dataShare, orderDetails) {
	$scope.currentTask;
	var loginDetail = dataShare.getData('loginDetails');
	var ordersDetails = dataShare.getData('updateData');
	
	switch (loginDetail.rolesDto.roleName){
		case "WarehousEmp":
			$scope.status = [{id:"1",status:'Received',img:'icon-status-green.png'},{id:"2",status:'Cancelled',img:'icon-status-red.png'},{id:"3",status:'Partial receipt',img:'icon-status-blue.png'}];
			break;
		case "LegoRep":
			$scope.status = [{id:"1",status:'New',img:'icon-status-blue.png'}];
			break;
		case "Supplier":
			$scope.status = [{id:"1",status:'Dispatched',img:'icon-status-blue.png'},{id:"2",status:'Received',img:'icon-status-green.png'},{id:"3",status:'Delayed',img:'icon-status-red.png'},{id:"4",status:'Cancelled',img:'icon-status-red.png'}];
			break;
		case "CustomsBroker":
			$scope.status = [{id:"1",status:'Dispatched',img:'icon-status-blue.png'},{id:"2",status:'Received',img:'icon-status-green.png'},{id:"3",status:'Delayed',img:'icon-status-red.png'},{id:"4",status:'Cancelled',img:'icon-status-red.png'}];
			break;
		case "Admin":
			$scope.status = [{id:"1",status:'Dispatched',img:'icon-status-blue.png'},{id:"2",status:'Received',img:'icon-status-green.png'},{id:"3",status:'Delayed',img:'icon-status-red.png'},{id:"4",status:'Cancelled',img:'icon-status-red.png'}];
			break;
	}
	$scope.updateStatus = function(data){
		var updateData = {
			  "status": $scope.currentTask,
			  "createdBy":loginDetail.createdBy,
			  "attrName": loginDetail.rolesDto.attrName,
			  "attrValue": loginDetail.rolesDto.attrValue,
			  "description": data.comments,
			  "orders": ordersDetails.orderId,
			  "linedetails": ordersDetails.linedetailsesDto[0].lineId
			}
		console.log(loginDetail, ordersDetails, $scope.currentTask)
		updateStatusService.updateStatus(updateData, function(response) {
			getOrderDetails(response, false);
			$scope.responseMsz = {"errorMessage" : "Status updated successfully for the Order Id :  " + response.orderId + "   and the Line Id:  " + response.lineId};
		});
	}
	
	function getOrderDetails(orderItem, isShow){
		$scope.isDone = false;
		if(isShow){
			if($(window).width() >= 375 && $(window).width() <= 767){
				$scope.showLeftPanel = false;
				$scope.showRightPanel = true;
				$scope.hideArrow = false;
			}
		}else{
			if($(window).width() >= 375 && $(window).width() <= 767){
				$scope.showLeftPanel = true;
				$scope.showRightPanel = false;
				$scope.hideArrow = false;
			}
		}
		
		orderDetails.getOrderDetails(orderItem.orderId, function(response) {
			response.linedetailsesDto[0].orderStatusesDto = response.linedetailsesDto[0].orderStatusesDto.sort(function(a, b){
				var a1 = a.id, b1=b.id;
				if( a1 == b1 ) return 0;
				return a1 > b1 ?  1 : -1;
			});
			
			angular.forEach(response.linedetailsesDto[0].orderStatusesDto, function(value, key) {
				if(value.createdDate){
					var dateTime = value.createdDate.split(" ");
					var dateFrmt = dateTime[0].split("-");
					var monthMap = {'01':'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'};
					response.linedetailsesDto[0].orderStatusesDto[key].month = monthMap[dateFrmt[1]];
					response.linedetailsesDto[0].orderStatusesDto[key].date = dateFrmt[2];
					response.linedetailsesDto[0].orderStatusesDto[key].time = dateTime[1];
				}
			});
			dataShare.setData({'updateData': response});
			$scope.orderData = response;
			
			
			$scope.isDone = true;
		});
	}
	
	$scope.close = function(){
		$modalInstance.close()
	}	
});

legoApp.controller("shippedDetailsCntrl", function($scope, $modalInstance) {
	console.log($scope);
	
	$scope.close = function(){
		$modalInstance.close()
	}	
});

legoApp.factory("dataShare", function($rootScope) {
	var data = [];
		return {
        setData : function(addData){
        	if(data.length > 0){
        		_.each(addData, function(key, value){
        			var index = _.findIndex(data, value);
            		if(index > 0){
            			data[index] = addData;
            		}else{
            			data.push(addData);
            		}
            	});
        		
    		}        		
    		else{
    			data.push(addData);
    		}
    		
    	},
        getData : function(key){
    		return data[_.findIndex(data, key)][key];
    	} 
    };
	
});