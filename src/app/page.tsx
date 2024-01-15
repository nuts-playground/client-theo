"use client";
import GameSection from "@/components/gameSection";
import GameList from "@/components/gameList";
import StatusSection from "@/components/statusSection";
import {
    Input,
    Button,
    ButtonGroup,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Listbox,
    ListboxItem,
    User,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import { IPlayer } from "@/interface/interface";
import { useAppSelector, useAppDispatch } from "./redux/hook";
import { setPlayer, selectPlayer } from "./redux/playerSlice";

interface IJoinCard {
    handleSubmit: Function;
    onSubmit: Function;
    register: Function;
}

const JoinModal = ({ handleSubmit, onSubmit, register }: IJoinCard) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const player = useAppSelector((state) => state.player);
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
            <h3 className="mb-1 pl-1 text-xl font-bold">Online players</h3>
            <Listbox
                className="mb-2 gap-0 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="There are no players currently online."
            >
                {players.map((player) => {
                    return (
                        <ListboxItem key={player.id}>
                            <Popover showArrow placement="bottom">
                                <PopoverTrigger>
                                    <User
                                        className="w-full justify-start"
                                        name={`${player.name}`}
                                        description={`Location: ${player.location}`}
                                    />
                                </PopoverTrigger>
                                <PopoverContent className="p-1">
                                    <ButtonGroup>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="sm"
                                        >
                                            Join the room
                                        </Button>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="sm"
                                        >
                                            Send message
                                        </Button>
                                    </ButtonGroup>
                                </PopoverContent>
                            </Popover>
                        </ListboxItem>
                    );
                })}
            </Listbox>
        </section>
    );
};

export default function Home() {
    // const [player, setPlayer] = useState<IPlayer>({} as IPlayer);
    const [socket, setSocket] = useState<any>({});
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const { register, handleSubmit, watch } = useForm();

    const player = useAppSelector((state) => state.player);
    console.log(player);
    const dispatch = useAppDispatch();

    const onSubmit = () => {
        socket.emit("joinPlayground", watch("playerName"));
    };

    useEffect(() => {
        const socket = io("http://localhost:3001");
        socket.on("sendPlayers", (players) => setPlayers(players));
        socket.on("joinPlayground", (isSuccess) => {
            if (isSuccess) {
                dispatch(
                    setPlayer({
                        id: socket.id as string,
                        name: watch("playerName"),
                        isReady: false,
                        location: "Lobby",
                    })
                );
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
                    {/* <div>{testPlayer}</div> */}
                    <PlayerList players={players} />
                    {player.id ? null : (
                        <JoinModal
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            register={register}
                        />
                    )}
                </>
            </StatusSection>
        </>
    );
}
