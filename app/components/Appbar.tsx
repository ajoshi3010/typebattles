"use client";
import { signOut, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

function Appbar() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    if (loading) {
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <img src="/favicon.ico" alt="Typebattles Icon" className="w-10 h-10 rounded-md mr-2 cursor-pointer" />
                        <span className="text-gray-200 text-4xl font-semibold pb-3 cursor-pointer">Typebattles</span>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <span className="text-gray-500 animate-bounce text-lg">Loading...</span>
                </div>
            </div>
        );
    }

    const imageUrl = session?.user?.image;
    console.log(session?.user);
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
                <div className="flex items-center">
                    <img src="/favicon.ico" alt="Typebattles Icon" className="w-10 h-10 rounded-md mr-2 cursor-pointer" />
                    <span className="text-gray-200 text-4xl font-semibold pb-3 cursor-pointer">Typebattles</span>
                </div>
                <i className="fas fa-keyboard text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"></i>
                <i className="fas fa-crown text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"></i>
                <i className="fas fa-info-circle text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"></i>
                <i className="fas fa-cog text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"></i>
            </div>
            <div className="flex items-center space-x-6">
                <i className="fas fa-bell text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"></i>

                {session?.user ? (
                    <>
                        <img
                            src={imageUrl?.toString()}
                            alt="User"
                            className="w-8 h-8 rounded-full cursor-pointer"
                            title={session.user?.name?.toString()} 
                        />
                        <i
                            className="fa fa-sign-out text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"
                            onClick={() => signOut()}
                        ></i>
                    </>
                ) : (
                    <i
                        className="fas fa-user text-gray-500 text-lg hover:text-white transition-colors duration-200 cursor-pointer"
                        onClick={() => signIn()}
                    ></i>
                )}
            </div>
        </div>
    );
}

export default Appbar;