
var app = angular.module("PB", ['firebase']);
var owner;
var latitude;
var longitude;
var animal;

app.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		}
	}
}]);

app.controller("Ctrl", function ($scope, $firebaseArray, $firebaseObject, $localstorage) {
	  $scope.name;
		$scope.height;
		$scope.weight;
		$scope.age;
		$scope.gender;
		$scope.thumbnail;
		$scope.marriged;
		$scope.family;
		$scope.type;
		$scope.detail;
		$scope.food;
		$scope.personality;

    var firebaseURL = "https://cyleepet.firebaseio.com/";

		$scope.$authData = $localstorage.get("authData");
		//console.log("Data : " + $scope.$authData);
		owner = $localstorage.get("authData")? JSON.parse($localstorage.get("authData")).uid : "";
		//console.log("owner : " + owner);

    $scope.getList = function() {
    	var echoRef = new Firebase(firebaseURL);
  		var query = echoRef.orderByChild("url");
  		$scope.profileArr = $firebaseArray(query);
    };

    $scope.add = function() {

	 		if (!navigator.geolocation){
  			return;
			}

			function success(position) {
		    latitude  = position.coords.latitude;
		    longitude = position.coords.longitude;
				animal = Math.floor(Math.random() * 100000) + 1;
				$scope.profileArr.$add({
					id: owner,
					pet: animal,
					name: $scope.name,
					height: $scope.height,
					weight: $scope.weight,
					age: $scope.age,
					gender: $scope.gender,
					thumbnail: $scope.thumbnail,
					marriged: $scope.marriged,
					family: $scope.family,
					type: $scope.type,
					detail: $scope.detail,
					food: $scope.food,
					personality: $scope.personality,
					latitude: latitude,
					longitude: longitude
				}).then(function() {
					location.href="mainpage_logined.html";
				});
	  	};

	  	function error() {

	  	};


	  	navigator.geolocation.getCurrentPosition(success, error);
    };

    $scope.remove = function (url) {
      $scope.profileArr.$remove(url);
    };


    $scope.FBLogin = function () {
      var ref = new Firebase(firebaseURL);
      ref.authWithOAuthPopup("facebook", function(error, authData) {
	      if (error) {
	        console.log("Login Failed!", error);
	      } else {
	        $scope.$apply(function() {
		        $scope.$authData = authData;
						owner = $scope.$authData.uid;

						$localstorage.set("authData", JSON.stringify(authData));
						console.log($localstorage.get("authData")+" is set.");

						// do something with the login info
						console.log("Authenticated successfully with payload:", authData);
						location.href="mainpage_logined.html";
	      	});
	      }
      },{remember:"default"});
    };

    $scope.FBLogout = function () {
      var ref = new Firebase(firebaseURL);
      ref.unauth();
      delete $scope.$authData;
			$localstorage.set("authData", false);
			console.log($localstorage.get("authData")+" is set.");
			location.href="index.html";
      // do something after logout
    };

		var refImg = new Firebase("https://cyleepet.firebaseio.com/");
		var ImgObj = $firebaseObject(refImg);


		function saveimage(e1) {
				var filename = e1.target.files[0];
				var fr = new FileReader();
				fr.onload = function (res) {
						$scope.thumbnail = res.target.result;
						/*ImgObj.image = res.target.result;
						ImgObj.$save().then(function (val) {
						}, function (error) {
								console.log("ERROR", error);
						})*/
				};
				fr.readAsDataURL(filename);
		}



		this.loadimage = function () {
				ImgObj.$loaded().then(function (obj) {
						$scope.thumbnail = obj.image;
						console.log("loaded", $scope.thumbnail);
						document.getElementById("file-upload").addEventListener('change', saveimage, false);
						//document.getElementById("profileImage").src = obj.image;
				}, function (error) {
						console.log("ERROR", error);
				});
		};
		this.loadimage();

    // load the list!
    $scope.getList();
});
