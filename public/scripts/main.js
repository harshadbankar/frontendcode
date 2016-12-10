
'use strict';

var app = angular.module("chargeandmove", ['ui.router']);
var api = {
  "addNotificationSubscription": "/notifyapi/addNotificationSubscription",
  "sendNotificationSubscription":"/notifyapi/sendNotificationSubscription"
}
const applicationServerPublicKey = 'BGl9q__A_LirBzVd5n-CHlBOyfKD6xAUoYL4ivMKxXdL6WhI0-JBLLMA86e-MhUY2CYkKvd0l1CxvWmpLOvORgY';


let isSubscribed = false;
let swRegistration = null;

var userData = {};
userData.userEmail = 'bankarharshad91@gmail.com';

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/currentLocation')

    $stateProvider
      .state('currentLocation', {
            url: '/currentLocation',
            templateUrl: '../templates/currentLocation.html',
            controller: 'currentLocation'
      })
      .state('search', {
            url: '/search',
            templateUrl: '../templates/search.html',
            controller: 'search'
      })
      .state('showNotify', {
            url: '/showNotify',
            templateUrl: '../templates/showNotify.html',
            controller: 'showNotify'
      })
      .state('showUserData', {
            url: '/showUserData',
            templateUrl: '../templates/showUserData.html',
            controller: 'showUserData'
      })
});

app.controller('currentLocation', function ($scope, $http, $state) {

// keep here code for currentLocation


});

app.controller('search', function ($scope, $http, $state) {

// keep here code for search

});

app.controller('showUserData', function ($scope, $http, $state) {
  
  // keep here code for showUserData

});


app.controller('showNotify', function ($scope, $http, $state) {
  var pushButton = document.querySelector('.js-push-btn');

  $scope.sendNotifyBtnFlag = false;
navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    //Manifest file:

    var head = document.head;
    var noManifest = true;
    // Walk through the head to check if a manifest already exists
    for (var i = 0; i < head.childNodes.length; i++) {
        if (head.childNodes[i].rel === 'manifest') {
            noManifest = false;
            break;
        }
    }
    // If there is no manifest already, add one.
    if (noManifest) {
        var manifest = document.createElement('link');
        manifest.rel = 'manifest';
        manifest.href = 'manifest.json';
        document.head.appendChild(manifest);
    }

    swRegistration = swReg;
    initialiseUI();
  })

  $scope.sendNotification = function () {
       $http({
            method: 'POST',
            url: api.sendNotificationSubscription,
            data: JSON.stringify({userEmail:"bankarharshad91@gmail.com", notificationText:"Charging has been done for your car"})
          }).then(function successCallback(response) {
             $scope.sendNotifyBtnFlag = true;
                if(response.data) 
                {
                    console.log('Notification send Success: '+JSON.stringify(response.data));
                }
              },
                function(response){
                    console.log('Notification send failed : '+JSON.stringify(response.data));
              });

  }
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  if(subscription !== null) {
  subscription.userEmail = userData.userEmail;
  $http({
            method: 'POST',
            url: api.addNotificationSubscription,
            data: JSON.stringify(subscription)
          }).then(function successCallback(response) {
             $scope.sendNotifyBtnFlag = true;
                if(response.data) 
                {
                  $scope.sendNotifyBtnFlag = true;
                  console.log('addNotificationSubscription Success: '+JSON.stringify(response.data));
                }
              },
                function(response){
                    console.log('addNotificationSubscription failed : '+JSON.stringify(response.data));
              });
}
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');
  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}
function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}
function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

});


