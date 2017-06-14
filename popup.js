
function authenticate() {
    chrome.runtime.sendMessage({"message": "start_oauth"});
    document.getElementById("title").innerText = "Wait while redirecting to Time Doctor....";
}


function userClicked() {
    var userID = this.id;
    var userName = this.innerText;

    chrome.storage.local.get(null, function(items){
        axios.get("https://webapi.timedoctor.com/v1.1/companies/" + items.companyID + "/users/" + userID + "/tasks", {
            headers: {"Authorization": "Bearer " + items.accessToken}
        }).then(function(response){
            var tasks = response.data.tasks;
            if(tasks.length > 0) {
              var taskListing = "<ul>";
              tasks.forEach(function (task) {
                taskListing += "<li>" + task.task_name + "</li>";
              });
              taskListing += "</ul>";

              document.getElementById("title").innerText = "List of tasks for " + userName;
              document.getElementById("content").innerHTML = taskListing;
            } else{
              document.getElementById("title").innerText = "No tasks were found for " + userName;
              document.getElementById("content").innerHTML = "";
            }
            document.getElementById("back").style.display = "block";
        });
    });
}

function getUsers() {
    chrome.storage.local.get(null, function(items){
        axios.get("https://webapi.timedoctor.com/v1.1/companies/" + items.companyID + "/users", {
            headers: {"Authorization": "Bearer " + items.accessToken}
        }).then(function(response){
            var users = response.data.users;
            if(users.length > 0) {
                var userListing = "<ul>";
                users.forEach(function (user) {
                  userListing += "<li><a href=\"#\" id=\"" + user.user_id + "\">" + user.full_name + "</a></li>";
                });
                userListing += "</ul>";

                document.getElementById("title").innerText = "List of users";
                document.getElementById("content").innerHTML = userListing;
                users.forEach(function (user) {
                  document.getElementById(user.user_id).onclick = userClicked;
                });
            } else {
                document.getElementById("title").innerText = "No users found in your company";
                document.getElementById("content").innerHTML = "";
            }
            document.getElementById("main").style.backgroundImage = "none";
            document.getElementById("back").style.display = "none";
        });
    });
}

function getCompany() {
    chrome.storage.local.get(null, function(items){
        axios.get("https://webapi.timedoctor.com/v1.1/companies", {
            headers: {"Authorization": "Bearer " + items.accessToken}
        }).then(function(response){
            if(response.data.accounts.length > 0) {
                var companyID = response.data.accounts[0].company_id;
                chrome.storage.local.set({
                  "companyID": companyID
                });
                getUsers();
            } else {
              document.getElementById("title").innerText = "No company is associated with your account";
            }
        });
    });
}

function loadUsers() {
    document.getElementById("content").innerHTML = "";
    document.getElementById("title").innerText = "Wait while loading content";
    document.getElementById("main").style.backgroundImage = "url(\"loading.gif\")";
    getCompany();
}

window.onload = function() {
    //chrome.storage.local.clear();
    chrome.storage.local.get(null, function(items){
        if(items.accessToken !== undefined){
            document.getElementById("authenticate").style.display = "none";
            loadUsers();
        }else{
            document.getElementById("main").style.backgroundImage = "none";
        }
    });
}
document.getElementById("authenticate").onclick = authenticate;
document.getElementById("back").onclick = loadUsers;
