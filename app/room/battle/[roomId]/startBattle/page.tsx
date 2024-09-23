"use client";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { ws } from "@/app/lib/webSocket";
import { CaretComponent } from "@/app/components/Caret";
import { PlayerCaretPosType } from "@/app/lib/handleType";
import { ResultType } from "@/app/lib/handleType";
import LeaderBoard from "@/app/components/LeaderBoard";
const Battle = ({ str, roomId,setStr, users, user, isAdmin, testDuration }: any) => {
    const [caretPos, setCaretPos] = useState({ wordIndex: 0, letterIndex: 0 });
    const [playersCaretPos, setPlayersCaretPos] = useState<PlayerCaretPosType>({});

    const [typedStatus, setTypedStatus] = useState<{ [letterIndex: number]: string }[]>([]);
    const [startBattle, setStartBattle] = useState(false);
    const [result, setResult] = useState<ResultType[]>([]);
    const [countdown, setCountdown] = useState<number>(0);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (!startBattle) return;
        setCaretPos(prevCaretPos => {
            var { wordIndex, letterIndex } = prevCaretPos;
            const words = str.split(" ");
            const word = words[wordIndex];
            const letter = word[letterIndex];
            // Handle regular typing
            if ((/^[a-zA-Z]$/.test(event.key) && letterIndex !== word.length)) {
                const battle_infoType = letter === event.key ? "crct_chars_typed" : "wrng_chars_typed";
                const msg = {
                    type: "UPDATE_BATTLE_INFO",
                    payload: {
                        roomId: roomId,
                        userId: user.id,
                        battle_infoType: battle_infoType
                    }
                }
                ws.send(JSON.stringify(msg));
                setTypedStatus(prevTypedStatus => {
                    const updatedTypedStatus = [...prevTypedStatus];
                    if (!updatedTypedStatus[wordIndex]) {
                        updatedTypedStatus[wordIndex] = {};
                        letterIndex = 0;
                    }
                    if (letterIndex !== 0)
                        updatedTypedStatus[wordIndex][letterIndex - 1] = (letter === event.key) ? "correct" : "wrong";
                    else
                        updatedTypedStatus[wordIndex][0] = (letter === event.key) ? "correct" : "wrong";
                    return updatedTypedStatus;
                });
                letterIndex++;
            }

            // Handle space to move to the next word
            if (event.key === " " && letterIndex === word.length) {
                wordIndex++;
                letterIndex = 0;
            }

            // Handle backspace
            if (event.key === "Backspace") {
                if (letterIndex > 0) {
                    letterIndex--;
                } else if (wordIndex > 0) {
                    wordIndex--;
                    letterIndex = words[wordIndex].length;
                }
                setTypedStatus(prevTypedStatus => {
                    const updatedTypedStatus = [...prevTypedStatus];
                    if (updatedTypedStatus[wordIndex]) {
                        updatedTypedStatus[wordIndex][letterIndex] = "";
                    }
                    return updatedTypedStatus;
                });
            }
            const msg = {
                type: "UPDATE_POS",
                payload: {
                    roomId: roomId,
                    userId: user.id,
                    name: user.name,
                    pos: { wordIndex: wordIndex, letterIndex: letterIndex }
                }
            };
            ws.send(JSON.stringify(msg));
            return { wordIndex, letterIndex };
        });
    }, [str, startBattle]);

    useEffect(() => {
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log(msg);
            if (msg.type === "START_BATTLE") {
                setStartBattle(true);
                setCountdown(testDuration);
            }
            if (msg.type === "UPDATE_POS") {
                const { name, pos } = msg.payload;
                setPlayersCaretPos((prev) => {
                    const lst = { ...prev };
                    lst[name] = pos;
                    return lst;
                });
            }
            if (msg.type === "RESULT") {
                setStartBattle(false);
                console.log(result);
                setResult(msg.result);
            }
            if(msg.type==="RESTART_BATTLE"){
                const {str,testDuration}=msg.payload;
                setStr(str);
                
            }
        }
    }, [])
    useEffect(() => {
        users.forEach((u: any) => {
            const name = u.name;
            setPlayersCaretPos((prev) => {
                const lst = { ...prev };
                lst[name] = { wordIndex: 0, letterIndex: 0 };
                return lst;
            });
        });
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress, startBattle]);
    const renderWords = () => {
        return str.split(" ").map((word: string, wordIndex: number) => (
            <div key={wordIndex} className="pr-5 inline-block font-roboto-mono">
                {word.split("").map((letter, letterIndex) => {
                    const isCorrect = typedStatus[wordIndex]?.[letterIndex] === "correct";
                    const isWrong = typedStatus[wordIndex]?.[letterIndex] === "wrong";
                    const textColor = isCorrect ? "text-tb-w" : isWrong ? "text-red-500" : "text-tb-grey";
                    return (
                        <span
                            key={letterIndex}
                            className={`inline-block ${textColor}`}
                        >
                            {caretPos.wordIndex === wordIndex && caretPos.letterIndex === letterIndex && (
                                <CaretComponent color="bg-tb-y" name={""} />
                            )}
                            {Object.entries(playersCaretPos).map(([playerId, playerPos]) => (
                                playerPos.wordIndex === wordIndex && playerPos.letterIndex === letterIndex && (
                                    <CaretComponent color="bg-tb-grey" name={playerId} />
                                )
                            ))}

                            {letter}
                        </span>
                    );
                })}
                {caretPos.wordIndex === wordIndex && caretPos.letterIndex === word.length && (
                    <CaretComponent color="bg-tb-y" name={""} />
                )}
                {Object.entries(playersCaretPos).map(([playerId, playerPos]) => (
                    playerPos.wordIndex === wordIndex && playerPos.letterIndex === word.length && (
                        <CaretComponent color="bg-tb-grey" name={playerId} />
                    )
                ))}
            </div>
        ));
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startBattle && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startBattle, countdown]);
    if (result.length) {
        return (
            <div className="flex flex-col justify-center items-center">
                <span>
                    <LeaderBoard id={user.id} result={result} />
                </span>
                <span >
                    {isAdmin &&
                        <input type="button" value="RESTART BATTLE" className="text-xl font-bold rounded pt-2  text-tb-grey hover:text-tb-w cursor-pointer" onClick={() => {
                            ws.send(JSON.stringify({
                                type: "RESTART_BATTLE",
                                payload: {
                                    roomId: roomId,
                                    testDuration: testDuration
                                }
                            }));
                            setResult([]);
                        }} />}
                </span>
            </div>
        );
    }
    return (
        <div>{isAdmin &&
            <input type="button" value="START BATTLE" className="absolute text-xl font-bold rounded pt-2  text-tb-grey hover:text-tb-w cursor-pointer" onClick={() => {
                ws.send(JSON.stringify({
                    type: "START_BATTLE",
                    payload: {
                        roomId: roomId,
                        testDuration: testDuration
                    }
                }));
            }} />}
            {startBattle &&
                <div className="absolute pt-10 text-xl text-tb-y">{countdown}</div>}
            <div
                className="text-3xl font-roboto-mono text-tb-grey leading-loose w-full pt-24"
            >
                {renderWords()}
            </div>
        </div>
    );
};

export default Battle;
