"use client";
import GameSection from "@/components/gameSection";
import GameList from "@/components/gameList";
import StatusSection from "@/components/statusSection";
import {
    Button,
    ButtonGroup,
    Listbox,
    ListboxItem,
    User,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IPlayer } from "@/interface/interface";
import { useAppSelector, useAppDispatch } from "./redux/hook";
import { setPlayer, selectPlayer } from "./redux/playerSlice";
import { setSocket } from "./redux/socketSlice";
import { JoinModal } from "@/components/joinModal";
import { selectPlayers } from "./redux/playersSlice";

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
    const player = useAppSelector(selectPlayer);
    const players = useAppSelector(selectPlayers);

    return (
        <>
            <GameSection>
                <GameList />
            </GameSection>
            <StatusSection>
                <>
                    <PlayerList players={players} />
                    {player.id ? null : <JoinModal />}
                </>
            </StatusSection>
        </>
    );
}
