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
import { useAppSelector } from "../app/redux/hook";

export const JoinModal = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const { register, handleSubmit, watch } = useForm();
    const socket = useAppSelector((state) => state.socketStore.socket);

    const onSubmit = () => {
        socket.emit("joinPlayground", watch("playerName"));
    };

    useEffect(() => {
        onOpen();
    }, []);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                <form
                    className="relative flex space-x-2 z-20"
                    onSubmit={handleSubmit(onSubmit)}
                >
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
                                placeholder="Enter your name and join"
                                {...register("playerName")}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" type="submit">
                                JOIN
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
};
