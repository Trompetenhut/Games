function openNavLogin() {
   setTimeout('$("#navLogin").dropdown("toggle")', 200);
}

$("#registerLink").on('click', function(){
    setTimeout('$("#navReg").dropdown("toggle")', 100);
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
      }else{
        console.log(error);
      }
    });
  }
}

function login() {
  $.post("/api/login", {
    username: document.getElementById('loginUsername').value,
    password: document.getElementById('loginPassword').value
  }, function(answer){
    $("#navLogin").dropdown("toggle");
    console.log(answer);
    document.getElementById('navLogin').innerHTML = "logout";
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
