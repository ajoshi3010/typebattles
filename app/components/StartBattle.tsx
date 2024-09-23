import React, { useEffect } from 'react'
import { ws } from '../lib/webSocket'

const StartBattle = ({ isWords, roomId }: { isWords: boolean, roomId: string }) => {

    const handleStartBattle = () => {
        ws.send(JSON.stringify({
            type: "START_BATTLE",
            payload: {
                roomId: roomId
            }
        }));
    }
    return (
        <div className='pt-5'>
            <div
                className='bg-tb-black text-tb-grey pt-2 pb-2 pl-10 pr-10 rounded-xl hover:text-tb-w cursor-pointer'
                onClick={isWords ? handleStartBattle : ()=>window.alert('Create Battle To Start Battle!')}
            >
                START BATTLE
            </div>
        </div>
    )
}

export default StartBattle
