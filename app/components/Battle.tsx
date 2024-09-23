"use client";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { ws } from "@/app/lib/webSocket";
import { CaretComponent } from "@/app/components/Caret";
import { PlayerCaretPosType, UserType } from "@/app/lib/handleType";

const Battle = ({  str, roomId, users, user, startBattle }: {  str: string, roomId: string, users: UserType[], user: UserType, startBattle: boolean }) => {
    const [caretPos, setCaretPos] = useState({ wordIndex: 0, letterIndex: 0 });
    const [playersCaretPos, setPlayersCaretPos] = useState<PlayerCaretPosType>({});

    const [typedStatus, setTypedStatus] = useState<{ [letterIndex: number]: string }[]>([]);
    console.log(startBattle);//Here its True
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        console.log(startBattle);//Here its False 
        if (!startBattle) return;
        setCaretPos(prevCaretPos => {
            var { wordIndex, letterIndex } = prevCaretPos;
            const words = str.split(" ");
            const word = words[wordIndex];
            const letter = word[letterIndex];
            console.log(word, letter);
            // Handle correct/incorrect key press
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

                // Update typedStatus
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
                    console.log(word, letter);
                    console.log(updatedTypedStatus[wordIndex][letterIndex]);
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

                // Clear typedStatus on backspace
                setTypedStatus(prevTypedStatus => {
                    const updatedTypedStatus = [...prevTypedStatus];
                    if (updatedTypedStatus[wordIndex]) {
                        updatedTypedStatus[wordIndex][letterIndex] = ""; // Clear the status of the letter
                    }
                    return updatedTypedStatus;
                });
            }

            // Send updated caret position
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


    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "UPDATE_POS") {
            console.log("Ostundi!")
            const { name, pos } = msg.payload;
            setPlayersCaretPos((prev) => {
                const lst = { ...prev };
                lst[name] = pos;
                return lst;
            });
        }
    }

    useEffect(() => {
        users.forEach((u) => {
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
    }, [handleKeyPress]);
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

    return (<>
        <div
            className="text-3xl font-roboto-mono text-tb-grey leading-loose w-full pt-24"
        >
            {renderWords()}
        </div>
    </>
    );
};

export default Battle;
