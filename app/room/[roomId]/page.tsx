"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ws } from "@/app/lib/webSocket";
import { useParams, useRouter } from "next/navigation";
import { SupportedMessage, ActiveItemType, AdminType, UserType, ResultType } from "@/app/lib/handleType";
import { RoomAppbar, Loading, Login, Modal, UsersButton, CreateBattle, Battle, StartBattle, ResultPage, CopyRoomId, CountDown, QuitBattle } from "@/app/components";


const Page = () => {
  const [activeItems, setActiveItems] = useState<ActiveItemType[]>([{ section: "section2", text: "time" }, { section: 'section3', text: '60' }]);
  const [startBattle, setStartBattle] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const path = useParams();
  const roomId = path.roomId as string;
  const [testDuration, setTestDuration] = useState<number>(60);
  const [users, setUsers] = useState<UserType[]>([]);
  const [admin, setAdmin] = useState<AdminType>({
    id: '',
    name: ''
  });
  const [result, setResult] = useState<ResultType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [words, setWords] = useState<string>("");
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const user = session?.user as UserType;
  useEffect(() => {
    if (user?.id && roomId) {
      const msg = {
        type: "VERIFY_USER",
        payload: {
          userId: user.id,
          roomId: roomId,
        },
      };
      ws.send(JSON.stringify(msg));
      ws.addEventListener("message", handleWebSocketMessage);
      return () => {
        ws.removeEventListener("message", handleWebSocketMessage);
      };
    }
  }, [user?.id, roomId, admin]);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    const handleRouteChange = () => {
      setShowModal(true);
      setPendingNavigation(null);
    };
    window.onpopstate = (e: PopStateEvent) => {
      e.preventDefault();
      handleRouteChange();
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);


  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "VERIFY_USER") {
      if (!msg.payload.exist) {
        router.push("/room");
      }
      if (admin?.id == '') setAdmin(msg.payload.admin);
      const battleInfo = msg.payload.battleInfo;
      if (battleInfo) {
        const { words, duration, gameConfig } = battleInfo;
        setTestDuration(duration);
        setWords(words);
        setActiveItems(gameConfig);
      }
      if (msg.payload.exist) {
        const msg = {
          type: SupportedMessage.GetAndNotify,
          payload: {
            name: user.name,
            image: user.image,
            userId: user.id,
            roomId: roomId,
          },
        };
        ws.send(JSON.stringify(msg));
      }
    }
    if (msg.type === "GAME_CONFIG") {
      const gameConfig: ActiveItemType[] = msg.payload.gameConfig;
      const val = gameConfig.find((item) => item.section === 'section3');
      if (val) {
        var testDuration = Number(val?.text);
        setTestDuration(testDuration);
      }
      setActiveItems(gameConfig);
    }
    if (msg.type === "USERS") {
      const newUser: UserType = msg.payload;
      setUsers((prevUsers) => {
        if (!prevUsers.find((user) => user.id === newUser.id)) {
          return [...prevUsers, newUser];
        }
        return prevUsers;
      });
    }
    if (msg.type === "CREATE_BATTLE") {
      const res = msg.payload;
      setWords(res.words);
    }
    if (msg.type === "START_BATTLE") {
      setStartBattle(true);
    }
    if (msg.type === "RESULT") {
      setStartBattle(false);
      setResult(msg.result);
    }
    if (msg.type === "NEW_BATTLE") {
      setWords("");
      setResult([]);
    }
    if (msg.type === "USER_LEFT") {
      const userId = msg.payload.userId;
      if (userId == user.id || userId == admin?.id) router.push("/room");
      setUsers((prev) => {
        const UpdatedUsers = prev.filter((user) => user.id !== userId);
        return UpdatedUsers;
      });
    }
  }, [admin]);
  const handleConfirmLeave = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    } else {
      window.history.back();
    }
    setShowModal(false);
  };

  const handleCancelLeave = () => {
    setShowModal(false);
  };
  if (status === "loading") return <Loading />;
  if (!session?.user) return <Login callbackUrl="/room" />;
  console.log(admin);
  return (
    <>
      {showModal && (
        <Modal
          title="Are you sure you want to leave?"
          description="Data will be lost if you exit this room."
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />
      )}

      <RoomAppbar userId={user?.id} isAdmin={admin?.id === user?.id} activeItems={activeItems} roomId={roomId} setActiveItems={setActiveItems} />
      {startBattle && <CountDown testDuration={testDuration} />}
      {!startBattle && (
        <div className="flex flex-col pt-2 pb-2 md:flex-row justify-between items-center gap-4 md:gap-0">
          <CopyRoomId rid={roomId} />
          <UsersButton users={users} />
          <QuitBattle userId={user.id} roomId={roomId} />
        </div>
      )}

      {result.length ? <ResultPage roomId={roomId} admin={admin} id={user.id} result={result} /> :
        <div className="flex flex-col gap-4">
          <div className="flex justify-start items-start">
            {(user.id === admin?.id && !startBattle) ? (
              <div className="flex space-x-4">
                <CreateBattle roomId={roomId} startBattle={startBattle} activeItems={activeItems} />
                <StartBattle roomId={roomId} isWords={words !== ""} />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="text-left w-full h-32">
            {words !== "" ?
              <>
                {!startBattle && admin?.id !== user.id && <span className="text-tb-w animate-pulse  text-xl">Waiting For {admin?.name} to Start Battle </span>}
                <Battle startBattle={startBattle} str={words} user={user} users={users} roomId={roomId} />
              </>
              :
              admin?.name == "" ?
                < span className="text-tb-w animate-pulse  text-xl">Current Battle in Progress, Please Wait for the Next Battle!</span> : admin?.id !== user.id ? <span className="text-tb-w animate-pulse text-xl">Waiting For {admin?.name} to Create Battle </span>
                  :
                  <span className="text-tb-w animate-pulse text-xl">Create Battle To Display The Words Here!</span>
            }
          </div>
        </div>
      }
    </>
  );
};

export default Page;

