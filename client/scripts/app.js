// YOUR CODE HERE:
var app = {};
app.init = function() {
  app.fetch();
  var datum;
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    data: 'order=-createdAt',
    success: function (data) {
      datum = data.results;
      addMessages(data.results);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  var userDiv = document.createElement("div"); 
  var msgDiv = document.createElement("div");
  var tweetDiv = document.createElement("div");
  var userNode = document.createTextNode(message.username); 
  var textNode = document.createTextNode(message.text); 
  tweetDiv.className = "tweet";
  msgDiv.className = "message";
  userDiv.className = "username";
  userDiv.id = "message";
  userDiv.appendChild(userNode);
  msgDiv.appendChild(textNode);
  tweetDiv.appendChild(userDiv);
  tweetDiv.appendChild(msgDiv);
  $('#chats').append(tweetDiv);
  // $('#chats').append(msgDiv);

  // var el = '<div class="tweet"><div id="message" class="username">' + message.username + '\n</div>';
  // el += '<div class = "message">' + message.text + '</div> ';
  // $('#chats').append(newDiv);
};

app.renderRoom = function(options) {
  //<option value="audi">Audi</option>
  $('#roomSelect').empty();
  var optionAll = document.createElement('option');
  var optionAllText = document.createTextNode("all");
  optionAll.className = "all";
  optionAll.value = "all";
  optionAll.appendChild(optionAllText);
  $('#roomSelect').append(optionAll);

  var optionAddNew = document.createElement('option');
  var optionAddText = document.createTextNode("addNew");
  optionAddNew.className = "addNew";
  optionAddNew.value = "addNew";
  optionAddNew.appendChild(optionAddText);
  $('#roomSelect').append(optionAddNew);

  var arr = [];
  for (var key in options) {
    if (arr.indexOf(options[key].roomname) === -1) {
      arr.push(options[key].roomname);
    }  
  }
  for (var i = 0; i < arr.length; i++) {
    var option = document.createElement('option');
    var optionText = document.createTextNode(arr[i]);
    option.value = arr[i];
    option.appendChild(optionText);
    //var option = '<option value="' + options + '">' + options + '</option>';
    $('#roomSelect').append(option);
  }
};

app.handleUsernameClick = function() {
  // $('.username')
};

app.handleSubmit = function() {
  var formText = $('#formText').val();
  var user = window.location.search.slice(10);
  var room = $('#roomSelect :selected').val();
  console.log(room);
  var message = {
    username: user,
    text: formText,
    roomname: room
  };
  app.clearMessages();
  app.send(message);
  app.fetch();
};

var addMessages = function(data) {
  app.renderRoom(data);
  for (var key in data) {
    app.renderMessage(data[key]);
  }
};

var makeRoom = function(roomName) {
  app.clearMessages();
  for (var key in datum) {
    if (datum[key].roomname === roomName) {
      app.renderMessage(datum[key]);
    }
  }
};

var blankRoom = function(roomName) {
  app.clearMessages();
  var optionNew = document.createElement('option');
  var optionNewText = document.createTextNode(roomName);
  optionNew.value = roomName;
  optionNew.appendChild(optionNewText);
  $('#roomSelect').append(optionNew);
};

$(document).ready(function() {
  app.init();

  $('body').on('click', '.username', function() {
    app.handleUsernameClick();
  });

  $('body').on('click', '.submit', function() {
    app.handleSubmit();
  });


  $('#roomSelect').change(function() {
    if ($(this).val() === 'all') {
      app.clearMessages();
      app.fetch();
    } else if ($(this).val() === 'addNew') {
      var newRoomName = prompt('Name of the room');
      blankRoom(newRoomName);
    } else {
      makeRoom($(this).val());
    }
  });
});