// export const ws = new WebSocket("ws://13.233.179.142:8080");
export const ws = new WebSocket('ws://localhost:8081');
// export const ws=new WebSocket("ws://3.110.148.161:8080");
ws.onopen = () => {
    console.log("CONNECTED TO WS!");
}
