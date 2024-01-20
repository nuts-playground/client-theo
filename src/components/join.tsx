import { useAppSelector } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import PopoverButton from "./popoverButton";

export const Join = () => {
    const socket = useAppSelector(selectSocket);
    const { register, handleSubmit, watch, setValue } = useForm();

    const onJoin = () => {
        if (watch("name")) {
            socket.emit("joinPlayground", watch("name"));
            setValue("name", "");
        }
    };

    return (
        <form className="flex space-x-1 h-12" onSubmit={handleSubmit(onJoin)}>
            <Input
                className="w-80"
                color="primary"
                placeholder="Enter your name"
                radius="full"
                size="sm"
                {...register("name")}
            />
            <PopoverButton
                condition={watch("name")}
                type="submit"
                buttonText="JOIN"
                popoverTitle="The name is empty."
                popoverText="Please enter name for multiplayer."
            />
        </form>
    );
};
