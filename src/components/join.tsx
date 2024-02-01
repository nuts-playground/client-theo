import { useAppSelector } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";

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
        <form
            className="w-full sm:flex sm:items-end"
            onSubmit={handleSubmit(onJoin)}
        >
            <Input
                className="mb-2 sm:mb-0"
                color="primary"
                label="이름"
                placeholder="홍길동"
                variant="underlined"
                size="sm"
                {...register("name")}
            />
            <Button
                className="w-full sm:w-20"
                size="sm"
                type="submit"
                isDisabled={!Boolean(watch("name"))}
                color={!Boolean(watch("name")) ? "default" : "primary"}
            >
                입장
            </Button>
        </form>
    );
};
