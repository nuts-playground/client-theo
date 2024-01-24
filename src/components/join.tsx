import { useAppSelector } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { Input } from "@nextui-org/react";
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
                placeholder="이름을 입력해주세요."
                radius="full"
                size="sm"
                {...register("name")}
            />
            <PopoverButton
                condition={watch("name")}
                type="submit"
                buttonText="JOIN"
                popoverTitle="이름 없습니다."
                popoverText="멀티플레이를 위해 이름을 입력해주세요."
            />
        </form>
    );
};
