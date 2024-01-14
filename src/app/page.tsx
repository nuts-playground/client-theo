"use client";
import GameSection from "@/components/gameSection";
import GameList from "@/components/gameList";
import StatusSection from "@/components/statusSection";
import {
    Input,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import { IPlayer } from "@/interface/interface";

interface IJoinCard {
    handleSubmit: Function;
    onSubmit: Function;
    register: Function;
}

const JoinModal = ({ handleSubmit, onSubmit, register }: IJoinCard) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

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

export default function Home() {
    const [player, setPlayer] = useState<IPlayer>({} as IPlayer);
    const [socket, setSocket] = useState({});
    const { register, handleSubmit, watch } = useForm();

    const onSubmit = () => {
        const socket = io("http://localhost:3001");
        socket.emit("joinPlayground", watch("playerName"));
        socket.on("joinPlayground", (isSuccess) => {
            if (isSuccess) {
                setPlayer({
                    id: socket.id as string,
                    name: watch("playerName"),
                    isReady: false,
                });
            }
        });
        setSocket(socket);
    };

    return (
        <>
            <GameSection>
                <GameList />
            </GameSection>
            <StatusSection>
                <>
                    <JoinModal
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        register={register}
                    />
                </>
            </StatusSection>
        </>
    );
}
