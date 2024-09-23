"use client";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { ws } from "../lib/webSocket";
import { SupportedMessage } from "../lib/handleType";
import { JoinRoomType, AddRoomType, SessionUserType } from "../lib/handleType";
import { useRouter } from "next/navigation";
import Login from "../components/Login";
import Loading from "../components/Loading";

export default function Room() {
    const [click, setClick] = useState<boolean>(false);
    const router = useRouter();
    const roomId = useRef<HTMLInputElement>(null);
    const { data: session, status } = useSession();
    if (click) return <Loading />;
    if (status === "loading") return <Loading />;
    if (!session?.user) return <Login callbackUrl="/room" />;
    const { name, id, image } = session.user as SessionUserType;
    const handleCreateRoom = () => {
        const payload: AddRoomType = {
            name: name,
            userId: id,
            image: image
        };
        const message = {
            type: SupportedMessage.AddRoom,
            payload: payload
        };
        ws.send(JSON.stringify(message));
        ws.onmessage = (event) => {
            const { type, payload } = JSON.parse(event.data);
            if (type === 'ROOM_ADDED') {
                const roomId = payload.roomId;
                router.push(`room/${roomId}`);
            }
        };
        setClick(true);
    };

    const handleJoinRoom = () => {
        const rid = roomId.current?.value;
        if (rid) {
            const payload: JoinRoomType = {
                name: name,
                image: image,
                userId: id,
                roomId: rid
            };
            const message = {
                type: SupportedMessage.JoinRoom,
                payload: payload
            };
            console.log(JSON.stringify(message));
            ws.send(JSON.stringify(message));

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'err') {
                    window.alert(msg.msg);
                } if (msg.type === 'ROOM_ADDED') {
                    const roomId = msg.payload.roomId;
                    router.push(`room/${roomId}`);
                    setClick(true);
                }
            };
        }
    };

    return (
        <>
            <div className="flex items-center justify-center h-[70vh]">
                <div className="max-w-sm w-full p-6 bg-gray-800 shadow-md rounded-lg">
                    <button className="w-full text-xl text-black py-2 px-4 rounded bg-tb-y hover:bg-tb-w transition-colors mb-4" onClick={handleCreateRoom}>
                        Create Room
                    </button>

                    <div className="relative flex items-center my-4">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="mx-4 text-gray-300">or</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <div className="mb-4">
                        <input
                            ref={roomId}
                            type="text"
                            name="roomid"
                            id="roomid"
                            placeholder="RoomId"
                            className="w-full p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <button className="w-full text-xl text-black py-2 px-4 rounded bg-tb-y hover:bg-tb-w transition-colors mb-4" onClick={handleJoinRoom}>
                        Join Room
                    </button>
                </div>
            </div></>
    );
}
