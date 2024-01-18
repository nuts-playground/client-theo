import { useAppSelector } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";

export const Join = () => {
    const socket = useAppSelector(selectSocket);
    const { register, handleSubmit, watch } = useForm();

    const onJoin = () => {
        socket.emit("joinPlayground", watch("name"));
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
            <Button
                className="h-full"
                color="primary"
                radius="full"
                type="submit"
            >
                JOIN
            </Button>
        </form>
    );
};
