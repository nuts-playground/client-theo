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
    Listbox,
    ListboxItem,
    User,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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

const PlayerList = ({ players }: { players: IPlayer[] }) => {
    return (
        <section>
            <h3 className="mb-1 pl-1 text-xl font-bold">실시간 접속자</h3>
            <Listbox
                className="mb-2 gap-0 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="There are currently no rooms available. Please make a room."
            >
                {players.map((player) => {
                    return (
                        <ListboxItem key={player.id}>
                            <User
                                name={player.name}
                                description={`Location: ${player.location}`}
                            />
                        </ListboxItem>
                    );
                })}
            </Listbox>
        </section>
    );
};

export default function Home() {
    const [player, setPlayer] = useState<IPlayer>({} as IPlayer);
    const [socket, setSocket] = useState<any>({});
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const { register, handleSubmit, watch } = useForm();

    const onSubmit = () => {
        socket.emit("joinPlayground", watch("playerName"));
    };

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("sendPlayers", (players) => setPlayers(players));
        socket.on("joinPlayground", (isSuccess) => {
            if (isSuccess) {
                setPlayer({
                    id: socket.id as string,
                    name: watch("playerName"),
                    isReady: false,
                    location: "Lobby",
                });
            }
        });
        setSocket(socket);
    }, []);

    return (
        <>
            <GameSection>
                <GameList />
            </GameSection>
            <StatusSection>
                <>
                    <PlayerList players={players} />
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
