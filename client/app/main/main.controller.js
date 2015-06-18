'use strict';

angular.module('eventsApp')
  .controller('MainCtrl', function ($scope, $http) {
    
    $scope.searchQuery = '';
    $scope.eventSearches = [];
    $scope.searchFocus = false;

    $scope.initializeEvent = function() {
      $scope.currentEvent = {
        title: '',
        from: new Date(),
        to: new Date(),
        location: '',
        description: '',
        participants: ['']
      };
      $scope.eventSearches = [];
    };

    //$scope.getAllEvents
    $scope.addEvent = function() {
      if($scope.currentEvent._id) {
        $scope.updateEvent();
      }
      else {
        $http.post('/api/events/',$scope.currentEvent).success(function(addedEvent) {
          addedEvent.from = convertDate(addedEvent.from);
          addedEvent.to = convertDate(addedEvent.to);
          $scope.currentEvent = addedEvent;
        });
      }
    };

    function convertDate(date){
      return new Date(date);
    }

    $scope.clickSearchResult = function(event) {
      event.from = convertDate(event.from);
      event.to = convertDate(event.to);
      $scope.currentEvent = event;
      $scope.searchFocus = false;
      $scope.searchQuery = event.title;
    };

    $scope.showEvent = function() {
      $http.get('/api/events/'+$scope.currentEvent._id).success(function(returnedEvent) {
        if(returnedEvent) {
          returnedEvent.from = convertDate(returnedEvent.from);
          returnedEvent.to = convertDate(returnedEvent.to);
          $scope.currentEvent = returnedEvent;
        }
        else {
          $scope.currentEvent = $scope.initializeEvent();
        }
      });
    };

    $scope.updateEvent = function() {
      $http.put('/api/events/'+$scope.currentEvent._id, $scope.currentEvent).success(function(updatedEvent) {
        updatedEvent.from = convertDate(updatedEvent.from);
        updatedEvent.to = convertDate(updatedEvent.to);
        $scope.currentEvent = updatedEvent;
      });
    };

    $scope.deleteEvent = function() {
      $http.delete('/api/events/' + $scope.currentEvent._id).success(function() {
        // reset event form
        $scope.initializeEvent();
      });
    };

    $scope.searchEvents = function() {
      if($scope.searchQuery){
        $http.get('/api/events/search/'+$scope.searchQuery).success(function(searchEvents) {
          $scope.eventSearches = searchEvents;
        });    
      }
      else {
        $scope.eventSearches = [];
      }
    };

    $scope.formatDate = function(date, mode) {
      date = new Date(date);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      if(mode === 'search') {
        return month+'/'+day;
      }
      return month+'/'+day+'/'+year;
    };

    $scope.addParticipants = function() {
      $scope.currentEvent.participants.push('');
    };
    
    $scope.initializeEvent();
  });
