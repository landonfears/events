'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('eventsApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('/api/events/3')
      .respond({
            _id: 3,
            title: 'Event 1',
            from: new Date('6/10/2015'),
            to: new Date('6/11/2015'),
            location: 'Cafe',
            description: 'Lunch with Mom',
            participants: ['me', 'Mom']
          });

    $httpBackend.whenPOST('/api/events/')
      .respond({
            _id: 4,
            title: 'Event 2',
            from: new Date('6/11/2015'),
            to: new Date('6/12/2015'),
            location: 'Movies',
            description: 'Catch a flick',
            participants: ['me', 'Joe']
          });

    $httpBackend.whenPUT('/api/events/4')
      .respond({
            _id: 4,
            title: 'Event 2',
            from: new Date('6/11/2015'),
            to: new Date('6/14/2015'),
            location: 'Movies',
            description: 'Catch a flick',
            participants: ['me', 'Joe']
          });

    $httpBackend.whenGET('/api/events/search/st')
      .respond([
          {
            _id: 5,
            title: 'Stargazing',
            from: new Date('6/11/2015'),
            to: new Date('6/12/2015'),
            location: 'Outside',
            description: 'Watch the stars',
            participants: ['me', 'Monica']
          },
          {
            _id: 6,
            title: 'Stargazing 1',
            from: new Date('6/12/2015'),
            to: new Date('6/13/2015'),
            location: 'Outside',
            description: 'Watch the stars again',
            participants: ['me', 'Monica']
          }
        ]);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should correctly initialize event', function () {
    scope.initializeEvent();
    expect(scope.currentEvent.title).toBe('');
    expect(scope.currentEvent.location).toBeDefined();
  });

  it('should get the correct event', function() {
      scope.currentEvent = {
        _id: 3
      }
      scope.showEvent();
      $httpBackend.flush();
      expect(scope.currentEvent.title).toBe('Event 1');
      expect(scope.currentEvent.participants.length).toBe(2);
  });

  it('should add the event correctly', function() {
      scope.currentEvent = {
        title: 'Event 2',
        from: new Date('6/11/2015'),
        to: new Date('6/12/2015'),
        location: 'Movies',
        description: 'Catch a flick',
        participants: ['me', 'Joe']
      }
      scope.addEvent();
      $httpBackend.flush();
      expect(scope.currentEvent._id).toBe(4);
  });

  it('should update the event correctly', function() {
      scope.currentEvent = {
        _id: 4,
        title: 'Event 2',
        from: new Date('6/11/2015'),
        to: new Date('6/14/2015'),
        location: 'Movies',
        description: 'Catch a flick',
        participants: ['me', 'Joe']
      }
      scope.updateEvent();
      $httpBackend.flush();
      expect(scope.currentEvent.to.getDate()).toBe(14);
  });

  it('should search the event correctly', function() {
      scope.searchQuery = 'st';
      scope.searchEvents();
      $httpBackend.flush();
      expect(scope.eventSearches.length).toBe(2);
  })
});
