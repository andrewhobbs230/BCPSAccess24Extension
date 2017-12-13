// Copyright (c) 2016 BCPS- Andrew Hobbs
//BCPS-Access24 Chrome Extension

// Create Global Variables
var CurrentLat;
var CurrentLong;
var CurrentEmail;
var Device;
var UpdateMainInterval = 600000; //Every 10 Minutes
var OSVersion;

// POST the data to the server using XMLHttpRequest
function addData() {
        // The URL to POST our data to
    var postUrl = 'https://aims.bullittschools.org/lock.asp';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);

    // Prepare the data to be POSTed by URLEncoding each field's contents
    //var title = encodeURIComponent(document.getElementById('title').value);
    //var Lat = data.coords.latitude;
    //var Long = data.coords.longitude;

    var params = 'Lat=' + CurrentLat + 
                 '&Long=' + CurrentLong +
                '&Email=' + CurrentEmail+
                '&DeviceID=' + Device;

    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    //xhr.onreadystatechange = function() { 
    //};

    // Send the request and set status
    xhr.send(params);
}

// Invoke the HTML5 Location info
function getPosition(){
    navigator.geolocation.getCurrentPosition( function(location) {
        CurrentLat = location.coords.latitude;
        CurrentLong = location.coords.longitude;
    });
   }

//Invoke Google Identity API
function getEmail(){
    chrome.identity.getProfileUserInfo( function(ident) {
        CurrentEmail = ident.email;    
    });
}

//Invoke Google Enterprise.DeviceAttributes API
function getDeviceID(){
    chrome.enterprise.deviceAttributes.getDirectoryDeviceId(function(asset_id) {
        Device = asset_id;    
    });
}

//Call the Functions to set the Global Variables
function Main(){
chrome.runtime.getPlatformInfo( function(platform) {
  if(platform.os == "cros") { 
getPosition();
getEmail();
getDeviceID();
addData();

  }
});

}


// Run the addData function to commit data to the AIMS Database every n Seconds
setInterval(Main, UpdateMainInterval)
