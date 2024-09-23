"use client";

import React from 'react'
import { ws } from '../lib/webSocket'
import { ActiveItemType } from '../lib/handleType'
const CreateBattle = ({ roomId, activeItems,startBattle }: { roomId: string,activeItems: ActiveItemType[] ,startBattle:boolean}) => {
  const handleCreateBattle = () => {
    const val = activeItems.find((item) => item.section === 'section3');
    var testDuration = 60;
    if (val) testDuration = Number(val?.text);
    ws.send(JSON.stringify({
      type: "CREATE_BATTLE",
      payload: {
        roomId: roomId
      }
    }));
  }
  return (
    <div className='pt-5'>
      <div
        className='bg-tb-black text-tb-grey pt-2 pb-2 pl-10 pr-10 rounded-xl hover:text-tb-w cursor-pointer'
        onClick={startBattle ? ()=>window.alert('Cannot Create Battle!') : handleCreateBattle}
      >
        CREATE BATTLE
      </div>
    </div>
  )
}

export default CreateBattle
