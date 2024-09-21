let websocket;  //웹소켓 객체를 저장할 변수를 선언합니다. 나중에 연결할 때 이 변수를 통해 서버와의 연결을 관리

function onOpen() { //웹소켓이 서버에 성공적으로 연결되었을 때 호출되는 함수
  websocket.send("connected"); //서버에 "connected"라는 메시지를 전송하여 클라이언트가 연결되었음을 알린다
  console.log("connected: onOpen()"); //연결 성공 메시지를 콘솔에 출력
}

function onMessage(receivedMessage) { // 서버에서 메시지가 클라이언트로 도착했을 때 호출
  showMessage(receivedMessage.data); //receivedMessage.data == 서버로부터 받은 메시지의 본문 데이터 ,showMessage(receivedMessage.data); == 받은 메시지를 화면에 표시하는 함수 호출
  console.log("received: onMessage()"); //메시지가 수신되었음을 콘솔에 출력
}

function onClose() { //서버와의 웹소켓 연결이 종료되었을 때 호출(예: 서버에서 연결을 끊거나 클라이언트에서 연결을 끊을 때)
  console.log("disconnected: onClose()");  //연결이 끊겼다는 메시지를 콘솔에 출력
}

function connect() { //웹소켓을 통해 서버에 연결하는 함수
  websocket = new WebSocket("ws://localhost:8080/ws/chats"); //서버의 웹소켓 경로에 연결을 시도
  websocket.onmessage = onMessage; //서버에서 메시지를 받을 때 호출할 함수(onMessage)를 설정
  websocket.onopen = onOpen; //서버에 연결되었을 때 호출할 함수(onOpen)를 설정
  websocket.onclose = onClose; //서버와 연결이 종료되었을 때 호출할 함수(onClose)를 설정

  setConnected(true); //연결 상태를 true로 설정하여 UI를 업데이트
  console.log("connected: connect()"); //연결 성공 메시지를 콘솔에 출력
}

function disconnect() { //웹소켓 연결을 종료하는 함수
  websocket.close(); // 웹소켓 연결을 닫고 서버와의 연결을 끊는다

  setConnected(false);// 연결 상태를 false로 설정하여 UI를 업데이트
  console.log("disconnected: disconnect()"); // 연결 종료 메시지를 콘솔에 출력
}

function sendMessage() { //사용자가 입력한 메시지를 서버로 전송하는 함수
  let message = document.getElementById("message"); //HTML에서 메시지를 입력하는 텍스트 필드를 가져온다

  websocket.send(message.value); // 입력된 메시지(message.value)를 서버로 전송
  message.value = ""; // 메시지를 보낸 후 텍스트 필드를 비운다
  console.log("sent: send()"); //메시지 전송을 콘솔에 출력
}

function showMessage(message) { // 서버에서 받은 메시지를 HTML 페이지에 표시하는 함수
  $("#messages").append("<tr><td>" + message + "</td></tr>"); //#messages: 메시지가 추가될 HTML 요소입니다 (보통 <table> 형식). , append: HTML 테이블에 새로운 행(<tr>)과 메시지를 추가
}

function setConnected(connected) { //UI에서 연결 상태에 따라 연결 버튼과 연결 해제 버튼을 활성화하거나 비활성화하는 함수
  $("#connect").prop("disabled", connected); //connected가 true면 연결된 상태이고, false면 연결되지 않은 상태
  $("#disconnect").prop("disabled", !connected);
  if (connected) { //연결되면 #conversation을 보여주고, 연결되지 않으면 숨긴다
    $("#conversation").show();
  } else {
    $("#conversation").hide();
  }
  $("#messages").html(""); //연결될 때마다 채팅 메시지를 지운다
}

$(function () { //페이지가 로드된 후 실행
  $("#connect").click(() => connect()); //연결 버튼을 클릭하면 connect() 함수가 호출
  $("#disconnect").click(() => disconnect()); //연결 해제 버튼을 클릭하면 disconnect() 함수가 호출
  $("#send").click(() => sendMessage()); //메시지 전송 버튼을 클릭하면 sendMessage() 함수가 호출
});