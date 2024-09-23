import React from 'react';
import { ResultType } from '../lib/handleType';

interface LeaderBoardProps {
    id: string;
    result: ResultType[];
}

const LeaderBoard = ({ id, result }: LeaderBoardProps) => {
    // Sort the result array by netWpm in descending order
    const sortedResults = [...result].sort((a, b) => b.netWpm - a.netWpm);

    // Find the current user's position in the sorted array
    const userIndex = sortedResults.findIndex(user => user.id === id);
    
    // Determine the position string (1st, 2nd, 3rd, etc.)
    const position = userIndex !== -1 ? `${userIndex + 1}${getPositionSuffix(userIndex + 1)}` : null;

    return (
        <div className="flex flex-col font-roboto-mono items-center justify-center">
            {/* Display the user's position */}
            {position && (
                <div className="text-gray-100 text-xl mb-4 animate-pulse">
                    {`${position} PLACE`}
                </div>
            )}

            {/* Leaderboard Table */}
            <table className=" bg-tb-black rounded-lg shadow-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="text-left text-tb-grey uppercase  text-sm py-3 px-6 ">Name</th>
                        <th className="text-left text-tb-grey uppercase  text-sm py-3 px-6 ">Net WPM</th>
                        <th className="text-left text-tb-grey uppercase  text-sm py-3 px-6 ">Accuracy (%)</th>
                        <th className="text-left text-tb-grey uppercase  text-sm py-3 px-6 ">Total Chars Typed</th>
                        <th className="text-left text-tb-grey uppercase  text-sm py-3 px-6 ">Correct Chars Typed</th>
                        <th className="text-left text-tb-grey uppercase  text-sm py-3 px-6 ">Wrong Chars Typed</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedResults.map((user, index) => (
                        <tr
                            key={index}
                            className={`text-gray-300 text-sm transition duration-200 ease-in-out ${user.id === id ? 'bg-slate-800 ' : 'hover:bg-slate-800'} cursor-pointer`}
                        >
                            <td className="py-4 px-6 flex items-center">
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="pl-3 text-gray-300">{user.name}</span>
                            </td>
                            <td className="py-4 px-6">{user.netWpm}</td>
                            <td className="py-4 px-6">{user.acc}%</td>
                            <td className="py-4 px-6">{user.tot_chars_typed}</td>
                            <td className="py-4 px-6">{user.crct_chars_typed}</td>
                            <td className="py-4 px-6">{user.wrng_chars_typed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper function to add position suffix (1st, 2nd, 3rd, etc.)
const getPositionSuffix = (position: number) => {
    if (position === 1) return 'ST';
    if (position === 2) return 'ND';
    if (position === 3) return 'RD';
    return 'TH';
};

export default LeaderBoard;
