"use client";

import React, { useEffect, useState } from 'react';

const count = ["3", "2", "1", "Start Typing!"];

const CountDown = ({ testDuration }: { testDuration: number}) => {
    const [countDown, setCountDown] = useState<number>(testDuration);
    const [ind, setInd] = useState<number>(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (ind < 4) {
            intervalId = setInterval(() => {
                setInd((prevInd) => prevInd + 1);
            }, 1000);
        } else {
            setCountDown(testDuration);
            intervalId = setInterval(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [ind, testDuration]);
    return (
        <div>
            {ind < 4 ? <div className="absolute pt-10 text-3xl animate-ping text-tb-y">{count[ind]}</div> : countDown > 0 ? <div className="absolute pt-10 text-3xl text-tb-y">{countDown}</div> : "Time's Up!"}
        </div>
    );
};

export default CountDown;
