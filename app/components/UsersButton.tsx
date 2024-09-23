import React, { useState } from 'react';
import { UserType } from '../lib/handleType';

const UsersButton = ({ users }: { users: UserType[] }) => {
    // State to control the visibility of the users list
    const [isListOpen, setIsListOpen] = useState(false);

    // Toggle the visibility of the users list
    const toggleList = () => {
        if(!users.length)return ;
        setIsListOpen(!isListOpen);
    };

    return (
        <div className='pt-5 '>
            <div 
                className='bg-tb-black text-tb-grey pt-2 pb-2 pl-10 pr-10 rounded-xl hover:text-tb-w cursor-pointer'
                onClick={toggleList}
            >
                Players Count: {users.length} 
            </div>

            {isListOpen && (
                <div className="bg-tb-black mt-2 p-4 rounded-xl max-h-64 fixed overflow-y-visible ">
                    {users.map((user, index) => (
                        (console.log(user.image)==null) &&
                        <div key={index} className="flex items-center mb-2">
                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full mr-4" />
                            <span className="text-tb-grey">{user.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UsersButton;
