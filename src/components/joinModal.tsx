import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Button,
} from "@nextui-org/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../app/redux/hook";
import { setJoinModal } from "@/app/redux/joinModalSlice";

export const JoinModal = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const { register, handleSubmit, watch } = useForm();
    const socket = useAppSelector((state) => state.socketStore.socket);
    const dispatch = useAppDispatch();

    const onSubmit = () => {
        socket.emit("joinPlayground", watch("playerName"));
    };

    useEffect(() => {
        dispatch(
            setJoinModal({
                onOpen,
                onClose,
                onOpenChange,
            })
        );
    }, []);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Theo playground
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            title="Name"
                            type="text"
                            color="primary"
                            size="sm"
                            maxLength={20}
                            minLength={2}
                            placeholder="Enter your name and join"
                            {...register("playerName")}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>
                            CLOSE
                        </Button>
                        <Button color="primary" onClick={onSubmit}>
                            JOIN
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
