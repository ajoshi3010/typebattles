import { useState, useRef } from "react";
import { FaCopy } from "react-icons/fa";

export default function CopyRoomId({ rid }: { rid: string }) {
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);

    const handleCopy = () => {
        if (rid) {
            navigator.clipboard.writeText(rid)
                .then(() => {
                    setCopySuccess("Room ID copied!");
                    setTimeout(() => setCopySuccess(null), 2000);
                })
                .catch(err => {
                    console.error("Failed to copy: ", err);
                    setCopySuccess("Failed to copy");
                });
        }
    };

    return (

        <div className="w-40 p-3 text-sm bg-tb-black shadow-lg rounded-lg">
            {!copySuccess ?
                <div className=" flex items-center   rounded">
                    <input
                        ref={roomIdRef}
                        type="text"
                        readOnly
                        value={"Copy ID : "+rid}
                        className="w-full text-tb-w bg-tb-black  rounded-l focus:outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className=" text-tb-w rounded-r"
                        aria-label="Copy Room ID"
                    >
                        <FaCopy />
                    </button>
                </div>
                : (
                    <p className="text-green-500">{copySuccess}</p>
                )}
        </div>
    );
}
