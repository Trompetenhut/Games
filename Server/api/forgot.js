var db = require('./db');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var sendfile = require('koa-sendfile');
var bcrypt = require('bcryptjs');

module.exports =
  {
    forgot:forgot,
    checkToken:checkToken,
    resetPassword:resetPassword
  };

function* forgot() {
  var email = this.request.body.email;
  var err;

  if(!validate(email)){
    err = {
      codeNr:1,
      message: "wrong validate"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var emailExits = yield isEmailExist(email);

  if(!emailExits){
    err = {
      codeNr:2,
      message: "No account with that email address exists."
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var token = jwt.sign({ email: email }, "test");
  token = token.substring(token.length - 40);

  if(!(yield setTokenInDB(email, token))){
    err = {
      codeNr:3,
      message: "Could not save in DB!"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://gemgames.me/reset/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n';
  var subject = 'gemgames.me Password Reset';


  if(!(sendMail(email, subject, text))){
    err = {
      codeNr:4,
      message: "Could not send mail to " + email
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  return this.response.status = 200;
}

function* checkToken() {
  var token = this.params.token;

  if(!(yield checkValid(token))){
    return this.response.body = "<h1>Password reset token is invalid or has expired.</h1><br><a href='http://gemgames.me'>Back to Homepage</a>";
  }

  var stats = yield* sendfile.call(this, __dirname + '/reset.html');
  if (!this.status) this.throw(404);

}

function checkValid(token) {
  return db("users").select().where("resetPasswordToken", token).then(rows => {
    var now = new Date();
    if(rows && rows.length == 1 && rows[0].resetPasswordExpires > now){
      return rows;
    }else{
      return false;
    }
  });
}

function* resetPassword() {
  var token = this.request.body.token;
  var password = this.request.body.password;
  var err;

  var user = yield checkValid(token);

  if(!user){
    err = {
      codeNr:1,
      message: "Password reset token is invalid or has expired."
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  if(!(yield saveNewPassword(token, password))){
    err = {
      codeNr:2,
      message: "Could not save new password" + email
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var subject = 'Your password has been changed';
  var text = 'Hello ' + user[0].name + '\n\nThis is a confirmation that the password for your account ' + user[0].mail + ' at gemgames.me has just been changed.';

  if(!(sendMail(user[0].mail, subject, text))){
    err = {
      codeNr:4,
      message: "Could not send mail to " + email
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  return this.response.status = 200;
}

function saveNewPassword(token, password) {
  return hashPassword(password).then(hash => {
    return db("users").update({
      password: hash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }).where("resetPasswordToken", token);
  });
}

function hashPassword(password){
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      if(err){
        return reject(err);
      }

      bcrypt.hash(password, salt, function(err, hash) {
        if(err){
          return reject(err);
        }

        return resolve(hash);
      });
    });
  });
}

function sendMail(email, subject, text) {
  // create reusable transporter object using SMTP transport
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAILUSER,
          pass: process.env.EMAILPW
      }
  });
  var mailOptions = {
      from: 'gemgames@passwortReset.com',
      to: email,
      subject: subject,
      text: text
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error)
          return false;
      }
      console.log('Message sent: ' + info.response);
  });
  return true;

}

function setTokenInDB(email, token) {
  var expire = new Date();
  expire.setHours(expire.getHours()+1);
  //var expire = new Date(now + 1 * (60*60*1000));

  return db("users").update({
    resetPasswordToken: token,
    resetPasswordExpires: expire
  }).where("mail", email);
}

function isEmailExist(email) {
  return db("users").select().where("mail", email).then(rows => {
    return (rows && rows.length > 0);
  });
}

function validate(email) {
  if(!email || email.length > 30){
    return false;
  }

  return true;
}
