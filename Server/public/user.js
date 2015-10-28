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

$("#navLogin").on('click', function(){
    setTimeout('$("#loginUsername").focus()', 100);
});

$("#navReg").on('click', function(){
    setTimeout('$("#regUsername").focus()', 100);
});

function register() {
  var everythingOK = true;

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
});

function login() {
  if(document.getElementById('loginUsername').value !== "" && document.getElementById('loginPassword').value !== ""){
    $.post("/api/login", {
      username: document.getElementById('loginUsername').value,
      password: document.getElementById('loginPassword').value
    }, function(response){
      $("#navLogin").dropdown("toggle");
      document.getElementById('navLoginText').innerHTML = "logout";
      document.getElementById('navRegText').innerHTML = response.username;
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);

      document.getElementById('highscore').hidden = false;
      document.getElementById('yourHighscoreText').innerHTML = "Your highscore: ";
      updateHighscore()

      //startAnimation();
      console.log(response);
    }).fail(function(error){
      console.log(error);
      var response = JSON.parse(error.responseText);
      console.log(response);
      if(response.codeNr == 2 || response.codeNr == 3){
        document.getElementById('errLogin').innerHTML = response.message;
        document.getElementById('errLogin').hidden = false;
      }else{
        console.log(error);
      }
    });
  }
}

function updateHighscore() {
  $.post("/api/getHighscore", {
    username: localStorage.getItem("username")
  }, function(response){
    document.getElementById('highscore').innerHTML = response[0].points
    localStorage.setItem("highscore", response[0].points);
  }).fail(function(error){
      console.log(error);
  });
}

function setHighscore() {
  $.post("/api/setHighscore", {
    username: localStorage.getItem("username"),
    points: points
  }, function(response){
    highscore = points
    document.getElementById('highscore').innerHTML = highscore;
    updateHighscoreList();
    console.log(response);
  }).fail(function(error){
      console.log(error);
  });
}

function updateHighscoreList() {
  var table = document.getElementById("highscoreTable");

  for(var i = table.rows.length - 1; i > 0; i--){
    table.deleteRow(i);
  }

  $.post("/api/highscoreList", {}, function(response){

    var rows = [];

    for (var i = 0; i < response.length; i++) {
      var item = response[i];

     rows.push({
          "rank"    : i+1,
          "name"    : item.user_id,
          "points"  : item.points,
          "date"    : moment.utc(item.created).fromNow()
      });
    }

    dynatable.settings.dataset.originalRecords = rows;
    dynatable.process();

  }).fail(function(error){
    console.log("fehler");
    console.log(error);
  });
}

function getHighscoreList() {
  var table = document.getElementById("highscoreTable");

  for(var i = table.rows.length - 1; i > 0; i--){
    table.deleteRow(i);
  }

  $.post("/api/highscoreList", {}, function(response){

    var rows = [];

    for (var i = 0; i < response.length; i++) {
      var item = response[i];

     rows.push({
          "rank"    : (i+1).toString(),
          "name"    : item.user_id,
          "points"  : (item.points).toString(),
          "date"    : moment(item.created).fromNow()
      });
    }

    dynatable = $('#highscoreTable').dynatable({
      dataset: {
        records: rows
      }
    }).data('dynatable');

  }).fail(function(error){
    console.log("fehler");
    console.log(error);
  });
}
