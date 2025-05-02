const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8081";
export const ws = new WebSocket(WS_URL);
