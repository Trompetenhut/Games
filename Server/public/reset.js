function newPassword() {
  var everythingOK = true;
  document.getElementById('errnewPassword').hidden = true;

  if(document.getElementById('newPassword1').value !== document.getElementById('newPassword2').value){
    document.getElementById('errnewPassword').innerHTML = "Passwords don't match";
    document.getElementById('errnewPassword').hidden = false;
    everythingOK = false;
  }

  if(everythingOK){
    $.post("/reset/:token", {
      password: document.getElementById('newPassword1').value,
      token: (window.location.pathname).substring(7, 47)
    }, function(answer){
      document.getElementById('AlertsentEmail').hidden = false;
      document.getElementById('newPassword1').value = "";
      document.getElementById('newPassword2').value = "";
      document.getElementById('idForm').hidden = true;
      document.getElementById('backToHomepage').hidden = false;
      console.log(answer);
    }).fail(function(error){
        console.log(error);

    });
  }
}

$(document).ready(function(){
 $(document).on('submit', '#formNewPassword', function(){return false;});
});
