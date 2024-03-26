import { useAppSelector } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { selectPlayer } from "@/app/redux/playerSlice";
import { useState } from "react";
import { motion } from "framer-motion";

export const Join = () => {
    const socket = useAppSelector(selectSocket);
    const { register, handleSubmit, watch, setValue } = useForm();

    const onJoin = () => {
        const name = watch("name");
        if (name) {
            socket.emit("joinPlayground", { name, location });
            setValue("name", "");
        }
    };

    return (
        <motion.form
            key="modal"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onJoin)}
        >
            <Input
                className="mb-2 sm:mb-0"
                color="primary"
                label="이름"
                placeholder="홍길동"
                variant="underlined"
                {...register("name")}
            />
            <Button
                className="w-full sm:w-20"
                type="submit"
                isDisabled={!Boolean(watch("name"))}
                color={!Boolean(watch("name")) ? "default" : "primary"}
            >
                입장
            </Button>
        </motion.form>
    );
};
