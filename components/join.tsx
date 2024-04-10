import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { SocketContext } from "@/context/socket";
import { UserContext } from "@/context/user";

export const Join = () => {
    const { register, handleSubmit, watch, setValue } = useForm();
    const socket = useContext(SocketContext);
    const player = useContext(UserContext);

    const onJoin = () => {
        const name = watch("name");
        if (name) {
            socket?.emit("registerUser", { name });
            setValue("name", "");
        }
    };

    return (
        <AnimatePresence>
            {!player && (
                <motion.div
                    layout
                    initial={{ bottom: "-10%", opacity: 0 }}
                    animate={{ bottom: 0, opacity: 1 }}
                    exit={{ bottom: "-10%", opacity: 0 }}
                    className="fixed bottom-0 w-full p-6 pt-4 backdrop-blur-lg z-10"
                >
                    <form onSubmit={handleSubmit(onJoin)}>
                        <div className="flex flex-col space-y-4">
                            <Input
                                color="primary"
                                label="닉네임"
                                placeholder="2 ~ 15글자, 영문/한글/숫자 사용 가능"
                                variant="underlined"
                                {...register("name")}
                            />
                            <Button
                                type="submit"
                                isDisabled={!Boolean(watch("name"))}
                                color={
                                    !Boolean(watch("name"))
                                        ? "default"
                                        : "primary"
                                }
                            >
                                게임 시작
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
