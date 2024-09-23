"use client";

import React from 'react'
import { ws } from '../lib/webSocket'


const QuitBattle = ({userId,roomId}: {userId:string,roomId:string}) => {
    const handleQuitBattle = () => {
        console.log(userId,roomId);
        ws.send(JSON.stringify({
            type: "QUIT_BATTLE",
            payload: {
                userId: userId,
                roomId: roomId
            }
        }));
    }
    return (
        <div className='pt-5'>
            <div
                className='bg-tb-black text-tb-grey pt-2 pb-2 pl-10 pr-10 rounded-xl hover:text-tb-w cursor-pointer'
                onClick={handleQuitBattle}
            >
                QUIT BATTLE
            </div>
        </div>
    )
}

export default QuitBattle;
