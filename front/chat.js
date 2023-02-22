const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const cid = urlParams.get('cid')
const u_name=sessionStorage.getItem("username");
const socket= io('http://localhost:3001')

socket.emit("connectUser", sessionStorage.getItem("username"),cid);

socket.on('chat-message', data => {
    console.log(data);
    $('#messsage-container').append('<li style="background-color:blue;padding:2px;color:white;margin-top:4px;">'+data+'</li>');
    $('#typing').text("");
  })

  $('form').submit(function() {
    console.log($('#m').val())
    $('#messsage-container').append('<li style="background-color:green;padding:2px;color:white;margin-top:4px;">'+$('#m').val()+'</li>');
    socket.emit('chat-message', $('#m').val());
    
  
    $('#m').val(" ");
    return false;
  });
  
  // receive chat message
  socket.on('chat_message', function(msg) {
    console.log(msg)
    $('#messages').append($('<li>').text(msg));
  });
  
  // send typing event
  $('#m').on('input', function() {
    socket.emit('typing', u_name,cid);
  });
  
  // receive typing event
  socket.on('typing', function(username) {
    $('#typing').text(username + ' is typing...');
  });