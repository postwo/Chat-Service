const stompClient = new StompJs.Client({ //STOMP 프로토콜을 사용하는 클라이언트를 생성
  brokerURL: 'ws://localhost:8080/stomp/chats' //ws://localhost:8080/stomp/chats로 연결을 시도
});

stompClient.onConnect = (frame) => { //서버에 성공적으로 연결되었을 때 호출되는 함수
  setConnected(true); //연결 상태를 true로 설정 UI를 업데이트
  console.log('Connected: ' + frame);
  stompClient.subscribe('/sub/chats', (chatMessage) => { ///sub/chats라는 경로에 구독합니다. 서버가 이 경로로 보낸 메시지를 받을 수 있습니다.
    showMessage(JSON.parse(chatMessage.body));
  });
  stompClient.publish({  ///pub/chats 경로로 메시지를 보낸다
    destination: "/pub/chats",
    body: JSON.stringify(
        {'sender': $("#username").val(), 'message': "connected"}) //메시지 내용 //사용자가 연결되었다는 알림을 서버에 보낸다
  })
};

stompClient.onWebSocketError = (error) => { //웹소켓 연결에서 오류가 발생했을 때 호출
  console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => { //서버가 STOMP 프로토콜에서 문제가 있다고 보고한 경우 호출
  console.error('Broker reported error: ' + frame.headers['message']);
  console.error('Additional details: ' + frame.body);
};

function setConnected(connected) { //UI에서 연결 상태에 따라 버튼과 대화 UI를 활성화/비활성화하는 함수
  $("#connect").prop("disabled", connected); // true면 연결된 상태이고, false면 연결되지 않은 상
  $("#disconnect").prop("disabled", !connected);
  if (connected) { //연결되면 #conversation을 보여주고, 연결되지 않으면 숨긴다
    $("#conversation").show();
  } else {
    $("#conversation").hide();
  }
  $("#messages").html("");
}

function connect() {
  stompClient.activate(); //STOMP 클라이언트를 활성화하여 서버에 연결
}

function disconnect() { //STOMP 클라이언트를 비활성화하여 서버와의 연결을 해제합니다. UI도 연결되지 않은 상태로 바꾼다
  stompClient.deactivate();
  setConnected(false);
  console.log("Disconnected");
}

function sendMessage() { //사용자가 입력한 메시지를 서버에 보낸다
  stompClient.publish({
    destination: "/pub/chats",  // /pub/chats 경로로 메시지를 보내고,
    body: JSON.stringify( //메시지 본문에는 sender와 message를 JSON 형태로 변환하여 포함
        {'sender': $("#username").val(), 'message': $("#message").val()})
  });
  $("#message").val("") //메시지를 보낸 후 입력란을 비운다
}

function showMessage(chatMessage) { //수신된 메시지를 HTML 테이블 형식으로 채팅 화면에 추가
  $("#messages").append( //chatMessage.sender == 메시지를 보낸 사람 , chatMessage.message == 보낸 메시지 내용.
      "<tr><td>" + chatMessage.sender + " : " + chatMessage.message
      + "</td></tr>");
}

$(function () {
  $("form").on('submit', (e) => e.preventDefault()); // 폼 제출 시 페이지가 새로고침되지 않도록 이벤트를 차단
  $("#connect").click(() => connect()); //연결 버튼 클릭 시 connect() 함수가 호출
  $("#disconnect").click(() => disconnect()); //연결 해제 버튼 클릭 시 disconnect() 함수가 호출
  $("#send").click(() => sendMessage()); //메시지 전송 버튼 클릭 시 sendMessage() 함수가 호출
});