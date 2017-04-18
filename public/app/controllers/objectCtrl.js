angular.module('objectController', ['objectServices', 'storyServices'])

    // Create a cultural object
    .controller('createObjectCtrl', function ($http, $location, Object, Story) {

        var app = this; // successMsg can be accessed outside the scope
        this.createObject = function (objectData) {
            app.errorMsg = false; // nezobrazuje errorMsg na stranke
            console.log(this.objectData);
            Object.createObject(app.objectData).then(function (data) {
                console.log(data.data.success);
                console.log(data.data.message);
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $location.path('/createobject');
                } else {
                    app.errorMsg = data.data.message;
                }
            });
        };
    })

    // Show all cultural objects
    .controller('allObjectCtrl', function (Object, Story, $scope, $http, $location, filterFilter, $routeParams) {
        var app = this;

        var uniqueItems = function (data, key) {
            var result = [];

            for (var i = 0; i < data.length; i++) {
                var value = data[i][key];

                if (result.indexOf(value) == -1) {
                    result.push(value);
                }
            }

            return result;
        };

        function getAllObjects() {
            Object.getAllObjects().then(function (data) {
                if (data.data.success) {
                    app.objects = data.data.objects;
                    $scope.objects = app.objects
                    console.log(data);
                }
            });
        }
        getAllObjects()

        // Function: Perform a basic search function
        app.search = function (searchObject) {
            // Check if a search keyword was provided
            if (searchObject) {
                // Check if the search keyword actually exists
                if (searchObject.length > 0) {
                    //app.limit = 0; // Reset the limit number while processing
                    $scope.searchFilterObject = searchObject; // Set the search filter to the word provided by the user
                    //app.limit = number; // Set the number displayed to the number entered by the user
                } else {
                    $scope.searchFilterObject = undefined; // Remove any keywords from filter
                    //app.limit = 0; // Reset search limit
                }
            } else {
                $scope.searchFilterObject = undefined; // Reset search limit
                //app.limit = 0; // Set search limit to zero
            }
        };

        // Function: Clear all fields
        app.clear = function () {
            //$scope.number = 'Clear'; // Set the filter box to 'Clear'
            //app.limit = 0; // Clear all results
            $scope.searchFilterObject = undefined;
            $scope.searchObject = undefined; // Clear the search word
            $scope.searchFilter = undefined; // Clear the search filter
            app.showMoreError = false; // Clear any errors
        };

        // Function: Perform an advanced, criteria-based search
        app.advancedSearchObject = function (searchByTitle, searchByCreator) {
            // Ensure only to perform advanced search if one of the fields was submitted
            if (searchByTitle || searchByCreator) {
                $scope.advancedSearchObjectFilter = {}; // Create the filter object
                if (searchByTitle) {
                    $scope.advancedSearchObjectFilter.title = searchByTitle; // If username keyword was provided, search by username
                }
                if (searchByCreator) {
                    $scope.advancedSearchObjectFilter.creator = searchByCreator; // If email keyword was provided, search by email
                }
                app.searchLimit = undefined; // Clear limit on search results
            }
        };

        // Function: Set sort order of results
        app.sortOrder = function (order) {
            app.sort = order; // Assign sort order variable requested by user
        };

        $scope.useClassification = {};
        $scope.useCreator = {};
        $scope.usePlacement = {};


        // Watch the title that are selected
        $scope.$watch(function () {
            return {
                objects: $scope.objects,
                useClassification: $scope.useClassification,
                useCreator: $scope.useCreator,
                usePlacement: $scope.usePlacement
            }
        }, function (value) {
            var selected;

            $scope.count = function (prop, value) {
                return function (el) {
                    return el[prop] == value;
                };
            };

            $scope.classificationGroup = uniqueItems($scope.objects, 'classification');
            var filterAfterClassification = [];
            selected = false;
            for (var j in $scope.objects) {
                var p = $scope.objects[j];
                for (var i in $scope.useClassification) {
                    if ($scope.useClassification[i]) {
                        selected = true;
                        if (i == p.classification) {
                            filterAfterClassification.push(p);
                            break;
                        }
                    }
                }
            }
            if (!selected) {
                filterAfterClassification = $scope.objects;
            }

            $scope.creatorGroup = uniqueItems($scope.objects, 'creator');
            var filterAfterCreators = [];
            selected = false;
            for (var j in filterAfterClassification) {
                var p = filterAfterClassification[j];
                for (var i in $scope.useCreator) {
                    if ($scope.useCreator[i]) {
                        selected = true;
                        if (i == p.creator) {
                            filterAfterCreators.push(p);
                            break;
                        }
                    }
                }
            }
            if (!selected) {
                filterAfterCreators = filterAfterClassification;
            }

            $scope.placementGroup = uniqueItems($scope.objects, 'placement');
            var filterAfterPlacement = [];
            selected = false;
            for (var j in filterAfterCreators) {
                var p = filterAfterCreators[j];
                for (var i in $scope.usePlacement) {
                    if ($scope.usePlacement[i]) {
                        selected = true;
                        if (i == p.placement) {
                            filterAfterPlacement.push(p);
                            break;
                        }
                    }
                }
            }
            if (!selected) {
                filterAfterPlacement = filterAfterCreators;
            }

            $scope.filteredObjects = filterAfterPlacement;
        }, true);


        $scope.$watch('filtered', function (newValue) {
            if (angular.isArray(newValue)) {
                console.log(newValue.length);
            }
        }, true);


        $scope.like = {};
        $scope.like.votes = 0;
        $scope.doVote = function () {
            if ($scope.like.userVotes == 1) {
                delete $scope.like.userVotes;
                $scope.like.votes--;

            } else {
                $scope.like.userVotes = 1;
                $scope.like.votes++;
            }
        }

        $scope.objectId = $routeParams.id;
        $scope.saveImage = function(imgUrl, objectId) {
            var data = {
                id: objectId,
                imgUrl: imgUrl
            };

            Story.editStory(data).then(function(response) {
                if (response.status === 200) {
                    app.successMsg = data.data.message;
                    // $location.path('/story/' + objectId);
                } else {
                    app.errorMsg = data.data.message;
                }
            });
        }

        // $scope.fcia = function () {
        //     console.log('madona')

        // }

        //      Object.getObject($routeParams.id).then(function (data) {

        //         if (data.data.success) {

        //             console.log($routeParams.id);
        //             console.log(data);
        //   }
        //         else {
        //             console.log('errorMsg');
        //         }
        //      });


    })

    .filter('count', function () {
        return function (collection, key) {
            var out = "test";
            for (var i = 0; i < collection.length; i++) {
                //console.log(collection[i].title);
                //var out = myApp.filter('filter')(collection[i].title, "42", true);
            }
            return out;
        }
    })


    .filter('groupBy',
    function () {
        return function (collection, key) {
            if (collection === null) return;
            return uniqueItems(collection, key);
        };
    })

    // Show one cultural object
    .controller('showObjectCtrl', function (Object, $scope, $routeParams, $http) {

        var app = this;

        function getAllObjects() {
            Object.getAllObjects().then(function (data) {
                if (data.data.success) {
                    app.objects = data.data.objects;
                    $scope.objects = app.objects
                    console.log(data);
                }
            });
        }
        getAllObjects();

        Object.getObject($routeParams.id).then(function (data) {

            if (data.data.success) {

                console.log($routeParams.id);
                console.log(data);

                $scope.objectTitle = data.data.object.title;
                $scope.objectCreator = data.data.object.creator;
                $scope.objectSubject = data.data.object.subject;
                $scope.objecttitleription = data.data.object.titleription;
                $scope.objectYear = data.data.object.year;
                $scope.objectPeriod = data.data.object.period;
                $scope.objectIdentifier = data.data.object.identifier;
                $scope.objectAuthorsRights = data.data.object.authors_rights;
                $scope.objectPropertyRights = data.data.object.property_rights;
                $scope.objectFormat = data.data.object.format;
                $scope.objectClassification = data.data.object.classification;
                $scope.objectWorkType = data.data.object.work_type;
                $scope.objectMeasurements = data.data.object.measurements;
                $scope.objectTechniques = data.data.object.techniques;
                $scope.objectMaterials = data.data.object.materials;
                $scope.objectPlacement = data.data.object.placement;
                $scope.objectArtMovement = data.data.object.art_movement;
                $scope.objectMediaObject = data.data.object.media_object;

                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ "address": $scope.objectPlacement }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                        $scope.latitude = results[0].geometry.location.lat();
                        $scope.longitude = results[0].geometry.location.lng();
                        console.log($scope.latitude);
                        console.log($scope.longitude);
                    }

                    var location = [
                        {
                            place: $scope.objectPlacement,
                            title: $scope.objectTitle,
                            creator: $scope.objectCreator,
                            latitude: $scope.latitude,
                            longitude: $scope.longitude,
                        }];

                    var mapOptions = {
                        zoom: 15,
                        center: new google.maps.LatLng(48.7220857, 21.257569500000045),
                        mapTypeId: google.maps.MapTypeId.TERRAIN
                    }

                    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                    $scope.markers = [];

                    var infoWindow = new google.maps.InfoWindow();

                    var createMarker = function (info) {

                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(info.latitude, info.longitude),
                            title: info.place
                        });
                        marker.content = '<div class="infoWindowContent">' + info.title + '<br>' + info.creator + '</div>';

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.setContent('<p><b><center>' + marker.title + '</center></b></p>' + marker.content);
                            infoWindow.open($scope.map, marker);
                        });

                        $scope.markers.push(marker);

                    }

                    createMarker(location[0]);

                    $scope.openInfoWindow = function (e, selectedMarker) {
                        e.preventDefault();
                        google.maps.event.trigger(selectedMarker, 'click');
                    }

                    // Display the current image inside the modal when it is clicked on
                    // Get the modal
                    var modal = document.getElementById('myModal');

                    // Get the image and insert it inside the modal - use its "alt" text as a caption
                    var img = document.getElementById('myImg');
                    var modalImg = document.getElementById("img01");
                    var captionText = document.getElementById("caption");
                    img.onclick = function () {
                        modal.style.display = "block";
                        modalImg.src = this.src;
                        captionText.innerHTML = this.alt;
                    }

                    // Get the <span> element that closes the modal
                    var span = document.getElementsByClassName("close")[0];

                    // When the user clicks on <span> (x), close the modal
                    span.onclick = function () {
                        modal.style.display = "none";
                    }
                });
            }
            else {
                console.log('errorMsg');
            }
        });
    })


    // Show all object creators
    .controller('allObjectsByCreatorsCtrl', function (Object, $scope, $http, $location) {

        var app = this;

        function getAllObjectsByCreators() {
            Object.getAllObjectsByCreators().then(function (data) {
                if (data.data.success) {
                    app.objects = data.data.objects;
                    $scope.objects = app.objects;
                }

                // filter to group objects by creator  
                var indexedCreators = [];

                $scope.objectsToFilter = function () {
                    indexedCreators = [];
                    return $scope.objects;
                }
                // autora zobrazí len raz, nie kolkokrát je jeho dielo
                $scope.filterCreators = function (object) {
                    var creatorIsNew = indexedCreators.indexOf(object.creator) == -1;
                    if (creatorIsNew) {
                        indexedCreators.push(object.creator);
                    }
                    return creatorIsNew;
                }
            });
        }
        getAllObjectsByCreators()
    })

    // // Show all object creators
    // .controller('allObjectsByCreatorCtrl', function (Object, $scope, $http, $location) {

    //     var app = this;

    //     function getAllObjectsByCreator() {
    //         Object.getAllObjectsByCreator().then(function (data) {
    //             if (data.data.success) {
    //                 app.objects = data.data.objects;
    //                 $scope.objects = app.objects;
    //             }

    //             $scope.filterCreator = 'Vojtech';  

    //         });
    //     }
    //     getAllObjectsByCreator()
    // })




    // Show all object creators
    .controller('allCreatorCtrl', function (Object, $scope, $http, $location) {

        var app = this;

        function getCreators() {
            Object.getCreators().then(function (data) {
                if (data.data.success) {
                    //$scope.objects = data.data.object.object;
                    app.objects = data.data.objects;
                    $scope.objects = app.objects;
                }

                // filter to group objects by creator  
                var indexedCreators = [];

                $scope.objectsToFilter = function () {
                    indexedCreators = [];
                    return $scope.objects;
                }

                $scope.filterCreators = function (object) {
                    var creatorIsNew = indexedCreators.indexOf(object.creator) == -1;
                    if (creatorIsNew) {
                        indexedCreators.push(object.creator);
                    }
                    return creatorIsNew;
                }
            });
        }
        getCreators()
    })