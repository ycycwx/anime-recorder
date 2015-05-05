var app = angular.module("app", []);

app.filter('range', function() {
    return function(input, start, end) {    
        start = parseInt(start);
        end   = parseInt(end);

        var direction = (start <= end) ? 1 : -1;

        while (start != end) {
            input.push(start);
            start += direction;
        }
        return input;
    };
});

app.controller("MainController", function ($scope, $http) {

    $scope.name         = "Anime Recorder";
    $scope.edit         = true;
    $scope.searchInput  = "";
    $scope.newShow      = {};
    $scope.newShow.done = false;
    $scope.totalDisp    = 5;
    $scope.moreSign     = true;
    $scope.currentYear  = new Date().getFullYear();

    $scope.showImage = {
        "background-image": 'url(./images/Cover.jpg)',
        "background-attachment": 'fixed',
        "background-repeat": 'no-repeat',
        "background-size": 'cover'
    };

    $scope.containerCss = {
        // "background-color": 'ivory',
        "background-color": '#ffffff',
        "opacity": 0.90
        // "background" : 'url(./images/Cover.jpg)'
    };

    $http.get("/animes").
        success(function(response) {
            $scope.shows = response;
        });

    $http.get('./orders.json').
        success(function(response) {
            $scope.orders = response;
            $scope.order  = $scope.orders[0];
        });

    $http.get('./complete.json').
        success(function(response) {
            $scope.completes = response;
            $scope.complete  = $scope.completes[0];
        });

    $scope.filterDone = function(show) {
        if ($scope.complete === 'Completed') {
            return show.done === true
        } else {
            return show.done === false
        };
    };

    $scope.filterBottom = function(show) {
        return (show.score >= $scope.bottom)
    };

    $scope.filterYear = function(show) {
        return (show.year >= $scope.startYear && show.year <= $scope.endYear)
    };

    $scope.loadMore = function() {
        $scope.totalDisp += 5;
        console.log($scope.totalDisp);
        console.log($scope.filtered.length);
        if ($scope.totalDisp >= $scope.filtered.length) {
            $scope.moreSign = false;
        };
    };

    $scope.calAvg = function() {
        console.log($scope.filtered.length);
        var size = $scope.filtered.length;
        var sum = 0;
        $scope.filtered.forEach(function(x){
            sum += x.score;
        });
        return sum / size
    };

    $scope.clearNewShow = function() {
        $scope.newShow = {};
        $scope.newShow.done = false;
        $scope.newShow.year = $scope.currentYear;
    };

    // $scope.archive = function() {
    //     // var oldShows = $scope.shows;
    //     $scope.oldShows = $scope.shows;
    //     $scope.shows = [];
    //     angular.forEach($scope.oldShows, function(show) {
    //         if (!show.done) $scope.shows.push(show);
    //     });
    // };

    // $http.post('/test', {msg:'hello word!'}).
    //     success(function(data, status, headers, config) {
    //         // this callback will be called asynchronously
    //         // when the response is available
    //         console.log(data);
    //     });

    // $scope.findById = function(id) {
    //     $http.get('/animes/' + id).
    //         success(function(response) {
    //             return response
    //         });
    // };

    $scope.addOne = function(show) {

        // Plus one episode
        show.episode ++;

        $http.put('/animes/' + show._id, show).
            success(function(data, status, headers, config) {
                if ('error' in data) {
                    console.log('Error in updating anime into MongoDB');
                }
                else {
                    console.log('Post success');
                    // $scope.shows.push($scope.newShow);
                    // console.log(data);

                    for (var i = 0; i < $scope.shows.length; i ++) {
                        if ( $scope.shows[i]._id == data['anime']._id ) {
                            $scope.shows[i] = data['anime'];
                            $scope.edit = true;
                        };
                    };

                };
                $scope.clearNewShow();
            }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Post error');
        });
    };

    // $scope.addOne = function(show) {
    //     var indexShow = $scope.shows.indexOf(show);
    //     $scope.shows[indexShow].episode += 1; 
    // };

    $scope.addShow = function() {
        if ($scope.edit) {
            // console.log('Add new show');
            // console.log($scope.newShow);
            $http.post('/animes', $scope.newShow).
                success(function(data, status, headers, config) {
                    console.log(data);
                    if ('error' in data) {
                        console.log('Error in creating anime into MongoDB');
                    }
                    else {
                        console.log('Post success');
                        // $scope.shows.push($scope.newShow);
                        $scope.shows.push(data['anime']);
                        console.log($scope.shows);
                    };
                    $scope.clearNewShow();
                }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Post error');
            });
        }
        else {
            $http.put('/animes/' + $scope.newShow._id, $scope.newShow).
                success(function(data, status, headers, config) {
                    if ('error' in data) {
                        console.log('Error in updating anime into MongoDB');
                    }
                    else {
                        console.log('Post success');
                        // $scope.shows.push($scope.newShow);
                        console.log(data);

                        for (var i = 0; i < $scope.shows.length; i ++) {
                            if ( $scope.shows[i]._id == data['anime']._id ) {
                                $scope.shows[i] = data['anime'];
                                $scope.edit = true;
                            };
                        };

                    };
                    $scope.clearNewShow();
                }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Post error');
            });
        };
    };

    // $scope.addShow = function() {
    //     var myvar = -1;
    //     for (var i = 0; i < $scope.shows.length; i ++) {
    //         if ( $scope.shows[i].title == $scope.newShow.title ) {
    //             myvar = i;
    //         };
    //     };
    //     if (~myvar) {
    //         $scope.shows[myvar] = $scope.newShow;
    //         $scope.newShow = {};
    //         $scope.edit = true;
    //     }
    //     else {
    //         $scope.shows.push($scope.newShow);
    //         $scope.newShow = {};
    //     };
    // }

    $scope.delShow = function(show) {
        // console.log(show._id);
        $http.delete('/animes/' + show._id).
            success(function(data, status, headers, config) {
                if ('error' in data) {
                    console.log('Error in creating anime into MongoDB');
                }
                else {
                    console.log('Post success');
                    console.log(data);
                    $scope.shows = data;
                };
            }).
            error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
                console.log(data);
                console.log('Post error');
        });
    };

    // $scope.delShow = function(show) {
    //     var indexShow = $scope.shows.indexOf(show);
    //     if (~indexShow) {
    //         $scope.shows.splice(indexShow, 1);
    //     };
    // };

    $scope.editShow = function(show) {
        if (show == 'new') {
            $scope.edit = true;
            $scope.clearNewShow();
        }
        else {
            $scope.edit            = false;
            $scope.newShow.title   = show.title;
            $scope.newShow.score   = show.score;
            $scope.newShow.episode = show.episode;
            $scope.newShow.note    = show.note;
            $scope.newShow.done    = show.done;
            $scope.newShow._id     = show._id;
            $scope.newShow.year    = parseInt(show.year);
            // console.log(Object.prototype.toString.call($scope.newShow.year));
        };
    };
});
