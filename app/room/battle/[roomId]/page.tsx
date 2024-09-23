"use client";
import RoomAppbar from "@/app/components/RoomAppbar";
import { useEffect, useState, useCallback, useRef, use } from "react";
import { ws } from "@/app/lib/webSocket";
import { useSession } from "next-auth/react";
import { SupportedMessage } from "@/app/lib/handleType";
import { useParams } from "next/navigation";
import Battle from "./startBattle/page";
const testDuration=10;
type User = {
    name: string;
    image: string;
    id: string;
};

export default function Lobby() {
    const path = useParams();
    const roomId = path.roomId as string;
    const [users, setUsers] = useState<User[]>([]);
    const { data: session } = useSession();
    const user = session?.user as User;
    const [admin, setAdmin] = useState<string>("");
    const [words, setWords] = useState("");
    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "USERS") {
            const newUser: User = msg.payload;
            console.log(msg);
            setAdmin(msg.admin);
            setUsers((prevUsers) => {
                if (!prevUsers.some((user) => user.name === newUser.name)) {
                    return [...prevUsers, newUser];
                }
                return prevUsers;
            });
        }
        if (msg.type === "CREATE_BATTLE") {
            const res = msg.payload;
            console.log(res);
            setWords(res.words);
        }
    }, []);

    const sendInitialMessage = useCallback(() => {
        if (user) {
            const msg = {
                type: SupportedMessage.GetAndNotify,
                payload: {
                    name: user.name,
                    image: user.image,
                    userId: user.id,
                    roomId: roomId,
                },
            };
            ws.send(JSON.stringify(msg));
        }
    }, []);

    useEffect(() => {
        ws.onmessage = handleWebSocketMessage;
        sendInitialMessage();

        return () => {
            ws.onmessage = null;
        };
    }, [handleWebSocketMessage, sendInitialMessage]);
    const createBattle = () => {
        ws.send(JSON.stringify({
            type: "CREATE_BATTLE",
            payload: {
                roomId: roomId,
                testDuration: testDuration
            }
        }));
    };

    return (
        <>
            {/* <RoomAppbar /> */}
            {words === "" ? (
                <div className="flex flex-col justify-center items-center font-roboto-mono">
                    <div className="flex items-center justify-center space-x-10 mt-8 h-[60vh]">
                        <UserProfile user={user} />
                        <div className="text-white text-xl ">VS</div>
                        <UserList users={users} admin={admin} user={user} />
                    </div>
                    {admin === user?.name && (
                        <button
                            onClick={createBattle}
                            className="px-4 py-2 bg-tb-y text-black rounded-lg"
                        >
                            Create Battle</button>)}
                </div>) : (<Battle str={words} setStr={setWords} testDuration={testDuration} user={user} isAdmin={admin==user.name} users={users} roomId={roomId} />)}
        </>
    );
}

function UserProfile({ user }: { user: User }) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <img
                src={user?.image?.toString()}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-gray-500"
            />
            <p className="text-white text-2xl">{user?.name}</p>
        </div>
    );
}

function UserList({ users, admin, user }: { users: User[], admin: string, user: User }) {
    return (
        <div className="flex flex-col space-y-4">
            {users.map((user, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <img
                        src={user.image}
                        alt={user.name}
                        className="w-16 h-16 rounded-full border-4 border-gray-500"
                    />
                    <p className="text-white ">{user.name}</p>
                </div>
            ))}
            {admin === user?.name || admin === "" ? (
                <div className="text-white text-md font-xl">
                    Waiting for players...
                </div>
            ) : (
                <div className="text-white text-md font-semibold">
                    Waiting for <span className="text-xl text-tb-y">{admin}</span> to create the battle...
                </div>
            )}
        </div>
    );
}
