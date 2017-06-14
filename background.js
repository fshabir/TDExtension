function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if( request.message==="start_oauth"){
      var link = "https://webapi.timedoctor.com/oauth/v2/auth?client_id=713_5762gm0shlwkko0ckoo4s84swsk8wcwcsk8kg88k88w4c0oo08&redirect_uri="
        + chrome.identity.getRedirectURL()
        + "&response_type=token";

      chrome.identity.launchWebAuthFlow({
        "url": link,
        "interactive": true
      }, function(responseUrl){
        chrome.storage.local.set({
          "accessToken": getParameterByName("access_token", responseUrl)
        });
        alert("Authentication successful. Click on extension icon to proceed.");
      });
    }
  }
);
