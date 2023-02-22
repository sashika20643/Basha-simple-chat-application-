const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const cid = urlParams.get('cid')
const u_name=sessionStorage.getItem("username");
const socket= io('http://localhost:3001')


let randomColor = "";
for (let i = 0; i < 3; i++)
randomColor += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2);

socket.emit("connectUser", sessionStorage.getItem("username"),cid,randomColor);

socket.on('chat-message', (data,color) => {
    console.log(data);
    $('#messsage-container').append('<li ><div style="color:white;padding:2px;background-color:#'+color+';margin-top:4px; border-radius:7px;max-width:60%;">'+data+'</div></li>');
    $('#typing').text("");
  })

  $('form').submit(function() {
    console.log($('#m').val())
    $('#messsage-container').append('<li ><div style="float:right;background-color:rgb(25, 195, 25);padding:2px;color:white;margin-top:4px;min-width:60%;border-radius:7px;">'+$('#m').val()+'</div></li>');
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