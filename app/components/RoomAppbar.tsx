"use client";
import React from 'react';
import { ActiveItemType } from '../lib/handleType';
import { ws } from '../lib/webSocket';
const ToolbarItem = ({ isAdmin, icon, text, active, onClick }: any) => (
    <div
        onClick={isAdmin ? onClick : undefined}
        className={`flex items-center gap-2 ${active ? "text-[#E2B714]" : "text-[#646669]"
            } transition-colors duration-300 hover:text-gray-300 cursor-pointer`}
    >
        <span>{icon && <i className={`fa ${icon}`}></i>}</span>
        <span>{text}</span>
    </div>
);

const RoomAppbar = ({ userId, isAdmin, activeItems, setActiveItems, roomId }: { userId: string, isAdmin: boolean, activeItems: ActiveItemType[], setActiveItems: React.Dispatch<React.SetStateAction<ActiveItemType[]>>, roomId: string }) => {
    const handleItemClick = (text: string, section: 'section1' | 'section2' | 'section3') => {
            let updatedItems;
            if (section === 'section1') {
                if (isActive(text, section)) {
                    // Remove item if it's active in section1
                    updatedItems = activeItems.filter(item => item.text !== text);
                } else {
                    // Add item if it's not active
                    updatedItems = [...activeItems, { section, text }];
                }
            } else {
                // Handle other sections (section2, section3)
                const sectionItems = activeItems.filter(item => item.section === section);
                const isActive = sectionItems.some(item => item.text === text);

                if (isActive) {
                    // Remove the active item if it's active in that section
                    updatedItems = activeItems.filter(item => item.section !== section);
                } else {
                    // Replace the active item for the section
                    updatedItems = activeItems.filter(item => item.section !== section).concat({ section, text });
                }
            }

            // Send updated game configuration after state update
            ws.send(JSON.stringify({
                type: "GAME_CONFIG",
                payload: {
                    userId: userId,
                    roomId: roomId,
                    gameConfig: updatedItems  // Use the updated items
                }
            }));

            return updatedItems;
    };

    const isActive = (text: string, section: 'section1' | 'section2' | 'section3') => {
        return activeItems.some(item => item.text === text && item.section === section);
    }

    return (
        <div className="flex justify-center pb-3">
            <div className="inline-flex flex-wrap text-sm gap-6 bg-tb-black py-2 px-4 font-sans rounded-lg w-full md:w-auto">
                {/* Section 1 */}
                <div className="flex items-center gap-6 border-b-2 md:border-r-2 md:border-b-0 border-[#646669] pb-4 md:pb-0 md:pr-6 w-full md:w-auto">
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon="fa-at"
                        text="punctuation"
                        active={isActive("punctuation", 'section1')}
                        onClick={() => handleItemClick("punctuation", 'section1')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon="fa-hashtag"
                        text="numbers"
                        active={isActive("numbers", 'section1')}
                        onClick={() => handleItemClick("numbers", 'section1')}
                    />
                </div>

                {/* Section 2 */}
                <div className="flex items-center gap-6 border-b-2 md:border-r-2 md:border-b-0 border-[#646669] pb-4 md:pb-0 md:pr-6 w-full md:w-auto">
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon="fa-clock"
                        text="time"
                        active={isActive("time", 'section2')}
                        onClick={() => handleItemClick("time", 'section2')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon="fa-font"
                        text="words"
                        active={isActive("words", 'section2')}
                        onClick={() => handleItemClick("words", 'section2')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon="fa-quote-right"
                        text="quote"
                        active={isActive("quote", 'section2')}
                        onClick={() => handleItemClick("quote", 'section2')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon="fa-cogs"
                        text="custom"
                        active={isActive("custom", 'section2')}
                        onClick={() => handleItemClick("custom", 'section2')}
                    />
                </div>

                {/* Section 3 */}
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon=""
                        text="15"
                        active={isActive("15", 'section3')}
                        onClick={() => handleItemClick("15", 'section3')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon=""
                        text="30"
                        active={isActive("30", 'section3')}
                        onClick={() => handleItemClick("30", 'section3')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon=""
                        text="60"
                        active={isActive("60", 'section3')}
                        onClick={() => handleItemClick("60", 'section3')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon=""
                        text="120"
                        active={isActive("120", 'section3')}
                        onClick={() => handleItemClick("120", 'section3')}
                    />
                    <ToolbarItem
                        isAdmin={isAdmin}
                        icon=""
                        text="180"
                        active={isActive("180", 'section3')}
                        onClick={() => handleItemClick("180", 'section3')}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoomAppbar;
