import React from 'react'
import { ResultType } from '../lib/handleType'
import LeaderBoard from './LeaderBoard';
import { ws } from '../lib/webSocket';

const ResultPage = ({ roomId, id, result, admin }: { roomId: string, id: string, result: ResultType[], admin: { id: string, name: string } }) => {
    const handleNewBattle = () => {
        const msg = { type: "NEW_BATTLE", payload: { roomId: roomId } };
        ws.send(JSON.stringify(msg));
    }
    return (
        <div className='flex flex-col justify-center space-y-6 items-center'>
            <LeaderBoard id={id} result={result} />
            {
                (admin.id === id) &&
                <div
                    className='bg-tb-black flex justify-center  text-tb-grey pt-2 pb-2 pl-10 pr-10 rounded-xl hover:text-tb-w cursor-pointer w-60'
                    onClick={handleNewBattle}
                >
                    NEW BATTLE
                </div>
            }

        </div>
    )
}

export default ResultPage;
