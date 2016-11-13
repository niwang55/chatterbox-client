// YOUR CODE HERE:
var datum;
var app = {};
var roomArray = [];
var friendsList = [];

app.init = function() {
  app.fetch('order=-createdAt');
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

app.fetch = function(query) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    data: query, //'order=-createdAt', //where={‘username’:’someusername'}
    success: function (data) {
      if (datum === undefined) {
        app.getRooms(data.results);
      }
      datum = data.results;
      if (query.slice(8, 16) === 'roomname') {
        addMessages(data.results, data.results[0].roomname);  
      } else {
        addMessages(data.results);
      }
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

app.getRooms = function(rooms) {
  for (var key in rooms) {
    if (roomArray.indexOf(rooms[key].roomname) === -1) {
      roomArray.push(rooms[key].roomname);
    }  
  }
};

app.renderMessage = function(message) {
  var userDiv = document.createElement("div"); 
  var msgDiv = document.createElement("div");
  var tweetDiv = document.createElement("div");
  var userNode = document.createTextNode(message.username); 
  var textNode = document.createTextNode(message.text); 
  var img = document.createElement('img');
  img.src = "https://image.freepik.com/free-icon/user-male-shape-in-a-circle-ios-7-interface-symbol_318-35357.jpg";
  img.className = "image";
  tweetDiv.className = "tweet";
  msgDiv.className = "message";
  userDiv.className = "username";
  userDiv.id = "message";
  userDiv.appendChild(userNode);
  msgDiv.appendChild(textNode);
  tweetDiv.appendChild(img);
  tweetDiv.appendChild(userDiv);
  tweetDiv.appendChild(msgDiv);
  $('#chats').append(tweetDiv);
  // $('#chats').append(msgDiv);

  // var el = '<div class="tweet"><div id="message" class="username">' + message.username + '\n</div>';
  // el += '<div class = "message">' + message.text + '</div> ';
  // $('#chats').append(newDiv);
};

app.renderRoom = function(options, selected) {
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

  //var arr = [];
  // for (var key in datum) {
  //   if (arr.indexOf(datum[key].roomname) === -1) {
  //     arr.push(datum[key].roomname);
  //   }  
  // }
  for (var i = 0; i < roomArray.length; i++) {
    var option = document.createElement('option');
    var optionText = document.createTextNode(roomArray[i]);
    option.value = roomArray[i];
    option.appendChild(optionText);
    //var option = '<option value="' + options + '">' + options + '</option>';
    $('#roomSelect').append(option);
  }
  if (selected !== undefined) {
    $('#roomSelect').val(selected);
  }
};

app.handleUsernameClick = function(node) {
  // $('.username')
  var username = node.text();
  if (friendsList.indexOf(username) === -1) {
    friendsList.push(username);
    node.parent().css('font-weight', '800');
    var children = $('#chats').children(); 
    for (var i = 0; i < children.length; i++) {
      if (children[i].children.message.innerHTML === username) {
        children[i].children[1].className = 'friend-message';
        //children[i].children()[1].css('font-weight', '800');
      }
    }
    // console.log(children[i].children.message.innerHTML);
    var friend = document.createElement('p');
    friend.className = 'friend-list friend-name';
    var friendText = document.createTextNode(username);
    friend.appendChild(friendText);
    $('.friends-list').append(friend);
  }
};

app.handleSubmit = function() {
  var formText = $('#formText').val();
  var user = window.location.search.slice(10);
  var room = $('#roomSelect :selected').val();
  var message = {
    username: user,
    text: formText,
    roomname: room
  };
  app.clearMessages();
  app.send(message);
  app.fetch('where={"roomname": "' + room + '"}');
};

var addMessages = function(data, selected) {
  app.renderRoom(data, selected);
  for (var key in data) {
    app.renderMessage(data[key]);
  }
};

var blankRoom = function(roomName) {
  app.clearMessages();
  var optionNew = document.createElement('option');
  var optionNewText = document.createTextNode(roomName);
  optionNew.value = roomName;
  optionNew.appendChild(optionNewText);
  if (roomArray.indexOf(roomName) === -1) {
    roomArray.push(roomName);
    app.getRooms(datum);
  }
  $('#roomSelect').append(optionNew);
  $('#roomSelect').val(roomName);
};

$(document).ready(function() {
  app.init();

  $('body').on('click', '.username', function() {
    app.handleUsernameClick($(this));
  });

  $('body').on('click', '.friend-name', function() {
    app.clearMessages();
    var name = $(this).context.innerHTML;
    app.fetch('where={"username": "' + name + '"}');
  });

  $('body').on('click', '.submit', function() {
    app.handleSubmit();
  });

  $('body').on('click', '.refresh', function() {
    app.clearMessages();
    app.fetch('order=-createdAt');
  });

  $('body').on('click', '.image', function() {
    var url = prompt('Give me an image url');
    $(this).context.src = url;
  });

  $('#roomSelect').change(function() {
    if ($(this).val() === 'all') {
      app.clearMessages();
      app.fetch('order=-createdAt');
    } else if ($(this).val() === 'addNew') {
      var newRoomName = prompt('Name of the room');
      blankRoom(newRoomName);
    } else {
      app.clearMessages();
      console.log($(this).val());
      app.fetch('where={"roomname": "' + $(this).val() + '"}');//where={‘username’:’someusername'}
    }
  });

});