import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "@/context/user";
import { AnimatePresence, motion } from "framer-motion";
import {
    Listbox,
    ListboxItem,
    ScrollShadow,
    Input,
    Button,
} from "@nextui-org/react";
import { SocketContext } from "@/context/socket";
import { ChatType } from "@/types";

export const Chat = () => {
    const socket = useContext(SocketContext);
    const player = useContext(UserContext);
    const [chats, setChats] = useState<ChatType[] | []>([]);
    const { register, handleSubmit, watch, reset, setFocus } = useForm();
    const scrollRef = useRef<HTMLElement | null>(null);

    const sendChat = () => {
        const text = watch("text");
        if (text) {
            socket?.emit("chat", { name: player?.name, text: watch("text") });
            reset();
            setTimeout(() => setFocus("text"), 0);
        }
    };

    useEffect(() => {
        socket?.on("chat", (chat: ChatType) => {
            setChats((prev) => [...prev, chat]);
        });

        return () => {
            socket?.off("chat");
        };
    }, [socket]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <AnimatePresence>
            {player && (
                <motion.div
                    layout
                    initial={{ bottom: "-10%", opacity: 0 }}
                    animate={{ bottom: 0, opacity: 1 }}
                    exit={{ bottom: "-10%", opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute inset-0 flex flex-col w-full p-6 pt-4 backdrop-blur-lg z-10"
                >
                    <ScrollShadow
                        className="relative grow mb-2"
                        ref={scrollRef}
                    >
                        <Listbox className="absolute justify-end">
                            {chats.map((chat) => {
                                return (
                                    <ListboxItem key={chat.id} className="p-0">
                                        <div className="flex w-full">
                                            <span className="flex-shrink-0 w-20 mr-2 overflow-hidden text-ellipsis">
                                                {chat.player}
                                            </span>
                                            <p className="whitespace-normal">
                                                {chat.text}
                                            </p>
                                        </div>
                                    </ListboxItem>
                                );
                            })}
                        </Listbox>
                    </ScrollShadow>

                    <form
                        className="flex rounded-lg overflow-hidden"
                        onSubmit={handleSubmit(sendChat)}
                    >
                        <Input
                            radius="none"
                            type="text"
                            {...register("text")}
                            size="sm"
                        />
                        <Button
                            radius="none"
                            color="primary"
                            type="submit"
                            size="sm"
                        >
                            전송
                        </Button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
