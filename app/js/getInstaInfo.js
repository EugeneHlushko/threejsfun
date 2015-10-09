if ( !dbg ) var dbg = {};
dbg.INSF = true;

function getInstaInfo(user, callback) {
  dbg.INSF && console.log('Will get profile info by username');

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var userData = JSON.parse(xhr.responseText);
        userData.response.initial = user;
        callback(userData.response);
      }
      else {
        dbg.INSF && console.log('XHR failed, msg: ', xhr.responseText);
      }
    }
  };
  xhr.open('GET', '/user?ebuilder='+user.id);
  xhr.send();
};
