"use client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useAppSelector } from "../../redux/hook";
import { selectRoom } from "@/app/redux/roomSlice";
import { RoomList } from "@/components/roomList";
import { Room } from "@/components/room";

const GAME_NAME = "guessing";
export default () => {
    const room = useAppSelector(selectRoom);

    return (
        <>
            <GameSection>
                <></>
            </GameSection>
            <StatusSection title="스무고개">
                {room.id ? <Room /> : <RoomList game={GAME_NAME} />}
            </StatusSection>
        </>
    );
};
