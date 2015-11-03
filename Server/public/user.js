function openNavLogin() {
   setTimeout('$("#navLogin").dropdown("toggle")', 200);
}

$("#registerLink").on('click', function(){
    setTimeout('$("#navReg").dropdown("toggle")', 100);
    setTimeout('$("#regUsername").focus()', 200);
});

$(".gotoLogin").on('click', function(){
    setTimeout('$("#navLogin").dropdown("toggle")', 100);
    setTimeout('$("#loginUsername").focus()', 200);
});

$(".gotoRegister").on('click', function(){
    setTimeout('$("#navReg").dropdown("toggle")', 100);
    setTimeout('$("#regUsername").focus()', 200);
});

$("#gotoForgot").on('click', function(){
  $("#navLogin").dropdown("toggle");
    $('#modalForgot').modal('show');
    setTimeout('$("#txtResetPassword").focus()', 200);
});

$("#navLogin").on('click', function(){
  $('#navLogin').blur();
  if(sessionStorage.getItem('token')){
    $("#navLogin").dropdown("toggle");
    logout();
  }else{
    setTimeout('$("#loginUsername").focus()', 100);
  }

});

$("#navReg").on('click', function(){
  if(sessionStorage.getItem('token')){
    $("#navReg").dropdown("toggle");
    document.getElementById('startAnimationBtn').focus();
    document.getElementById('startAnimationBtn').blur();
  }else{
    setTimeout('$("#regUsername").focus()', 100);
  }

});

function logout() {
  sessionStorage.removeItem("token");
  document.getElementById('navLoginText').innerHTML = "Login";
  document.getElementById('highscore').hidden = true;
  document.getElementById('yourHighscoreText').innerHTML = '<a href="#" class="gotoLogin">Login</a> or <a href="#" class="gotoRegister">Register</a> to save your highscore!';
  document.getElementById('navRegText').innerHTML = "Register";
}

function register() {
  var everythingOK = true;
  document.getElementById('errRegUsername').hidden = true;
  document.getElementById('errRegVerifyPassword').hidden = true;
  document.getElementById('errRegEmail').hidden = true;

  if(!((document.getElementById('regUsername').value.charAt(0)).match(/[a-z]/i))){
    document.getElementById('errRegUsername').innerHTML = "Username must start with a letter";
    document.getElementById('errRegUsername').hidden = false;
    everythingOK = false;
  }

  if(document.getElementById('regPassword1').value !== document.getElementById('regPassword2').value){
    document.getElementById('errRegVerifyPassword').innerHTML = "Passwords don't match";
    document.getElementById('errRegVerifyPassword').hidden = false;
    everythingOK = false;
  }

  if(everythingOK){
    $.post("/api/register", {
      username: document.getElementById('regUsername').value,
      password: document.getElementById('regPassword1').value,
      email: document.getElementById('regEmail').value
    }, function(answer){
      $("#navReg").dropdown("toggle");
      login(document.getElementById('regUsername').value, document.getElementById('regPassword1').value);
      document.getElementById('regUsername').value = "";
      document.getElementById('regPassword1').value = "";
      document.getElementById('regPassword2').value = "";
      document.getElementById('regEmail').value = "";
      console.log("answer: "+answer);
    }).fail(function(error){
      var response = JSON.parse(error.responseText);
      if(response.codeNr == 2){
        document.getElementById('errRegUsername').innerHTML = response.message;
        document.getElementById('errRegUsername').hidden = false;
      }else if(response.codeNr == 3){
        document.getElementById('errRegEmail').innerHTML = response.message;
        document.getElementById('errRegEmail').hidden = false;
      }else{
        console.log(error);
      }
    });
  }
}

$(document).ready(function(){
 $(document).on('submit', '#formLogin', function(){return false;});
 $(document).on('submit', '#formReg', function(){return false;});
 $(document).on('submit', '#formForgot', function(){return false;});
});

function checkLogin() {
  if(document.getElementById('loginUsername').value !== "" && document.getElementById('loginPassword').value !== ""){
      login(document.getElementById('loginUsername').value, document.getElementById('loginPassword').value);
  }
}

function sendEmail() {
  document.getElementById('errResetPassword').hidden = true;

  $.post("/api/forgot", {
    email: document.getElementById('txtResetPassword').value
  }, function(response){
    document.getElementById('txtAlertsentEmail').innerHTML = "An e-mail has been sent to " + document.getElementById('txtResetPassword').value + " with further instructions.";
    document.getElementById('AlertsentEmail').hidden = false;
    document.getElementById('txtResetPassword').value = "";

  }).fail(function(error){
    var response = JSON.parse(error.responseText);

    if(response.codeNr == 2){
      document.getElementById('errResetPassword').innerHTML = response.message;
      document.getElementById('errResetPassword').hidden = false;
    }else{
      document.getElementById('errResetPassword').innerHTML = "Error sending Email. Please try again later";
      document.getElementById('errResetPassword').hidden = false;
      console.log(error);
    }
  });


}

function logedIn() {
  document.getElementById('navLoginText').innerHTML = "logout";
  document.getElementById('navRegText').innerHTML = sessionStorage.getItem('username');

  document.getElementById('highscore').hidden = false;
  document.getElementById('yourHighscoreText').innerHTML = "Your highscore: ";
  updateHighscore();
}

function login(username, password) {
  document.getElementById('errLogin').hidden = true;

  $.post("/api/login", {
    username: username,
    password: password
  }, function(response){
    document.getElementById('loginUsername').value = "";
    document.getElementById('loginPassword').value = "";
    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("username", response.username);
    $("#navReg").click();
    logedIn();

  }).fail(function(error){
    var response = JSON.parse(error.responseText);

    if(response.codeNr == 2 || response.codeNr == 3){
      document.getElementById('errLogin').innerHTML = response.message;
      document.getElementById('errLogin').hidden = false;
    }else{
      console.log(error);
    }
  });

}

function updateHighscore() {

  $.ajax({
    type:"POST",
	  url: '/api/getHighscore',
	  headers: {
		'X-Auth-Token': sessionStorage.getItem('token')
  	},
  	data: {
  		username: sessionStorage.getItem('username')
  	},
  	success: function(response){
      document.getElementById('highscore').innerHTML = response[0].points;
      sessionStorage.setItem("highscore", response[0].points);
  	},
    error: function(error){
      console.log(error);
  	},
  });
}

function setHighscore() {
  console.log("send username vom client");
  $.ajax({
    type:"POST",
	  url: '/api/setHighscore',
	  headers: {
		'X-Auth-Token': sessionStorage.getItem('token')
  	},
  	data: {
  		username: sessionStorage.getItem('username')
  	},
  	success: function(response){
      console.log("highscore: " + highscore);
      document.getElementById('highscore').innerHTML = highscore;
      updateHighscoreList(true);
  	},
    error: function(error){
      console.log(error);
  	},
  });
  /*
  $.ajax({
    type:"POST",
	  url: '/api/setHighscore',
	  headers: {
		'X-Auth-Token': sessionStorage.getItem('token')
  	},
  	data: {
  		username: sessionStorage.getItem('username'),
      points: points
  	},
  	success: function(response){
      highscore = points
      document.getElementById('highscore').innerHTML = highscore;
      updateHighscoreList(true);
  	},
    error: function(error){
      console.log(error);
  	},
  });*/
}

function updateHighscoreList(update) {
  var table = document.getElementById("highscoreTable");

  $.post("/api/highscoreList", {}, function(response){

    var rows = [];

    for (var i = 0; i < response.length; i++) {
      var item = response[i];

     rows.push({
          "rank"    : (i+1).toString(),
          "name"    : item.user_id,
          "points"  : (item.points).toString(),
          "date"    : moment.utc(item.created).fromNow()
      });
    }

    if(update){
      dynatable.settings.dataset.originalRecords = rows;
      dynatable.process();
    }else{
      dynatable = $('#highscoreTable').dynatable({
        dataset: {
          records: rows
        }
      }).data('dynatable');
    }


  }).fail(function(error){
    console.log("Cant load world highscore list: " + error);
  });
}
