import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";

export const Join = () => {
    const { register, handleSubmit, watch, setValue } = useForm();

    const onJoin = () => {
        const name = watch("name");
        // if (name) {
        //     socket.emit("joinPlayground", { name, location });
        //     setValue("name", "");
        // }
    };

    return (
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
                    color={!Boolean(watch("name")) ? "default" : "primary"}
                >
                    게임 시작
                </Button>
            </div>
        </form>
    );
};
