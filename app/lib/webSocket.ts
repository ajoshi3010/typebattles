// export const ws = new WebSocket("ws://localhost:8080", "echo-protocol");
export const ws = new WebSocket('ws://13.51.150.172:8080');
ws.onopen=()=>{
    console.log("CONNECTED TO WS!");
}
