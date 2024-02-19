"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { GameBoard, createGridBoard } from "@/components/gameBoard";
import { useAppSelector } from "../../redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectSocket } from "@/app/redux/socketSlice";
import { selectRoom } from "@/app/redux/roomSlice";
import { RoomList } from "@/components/roomList";
import { Room } from "@/components/room";
import { Game, IGameCell } from "@/types";

const game: Game = {
    name: "tictactoe",
    maxPlayers: 2,
    minPlayers: 2,
};

export default () => {
    const room = useAppSelector(selectRoom);
    const player = useAppSelector(selectPlayer);
    const socket = useAppSelector(selectSocket);

    const onClick = (y: number, x: number) => {
        socket.emit("turnEnd", { y, x, player, room });
    };

    const resetBoard = () => {
        socket.emit("resetRoom", createGridBoard(3, 3));
    };

    const exitRoom = () => {
        socket.emit("exitRoom");
    };

    return (
        <>
            <GameSection>
                <GameBoard
                    gridBoard={room.gameData as IGameCell[][]}
                    cellClick={onClick}
                    isStart={room.isStart}
                ></GameBoard>
            </GameSection>
            <StatusSection title="틱택토">
                <>
                    {room.id ? (
                        <Room />
                    ) : (
                        <RoomList
                            game={game}
                            initGameData={createGridBoard(3, 3)}
                        />
                    )}

                    <Modal isOpen={Boolean(room.winner)} size="sm">
                        <ModalContent>
                            <ModalHeader className="flex flex-col gap-1">
                                게임 결과
                            </ModalHeader>
                            <ModalBody className="pb-4">
                                {room.winner === "drow"
                                    ? "무승부"
                                    : `승자 ${room.winner}`}
                                <br />
                                {room.master === player.name
                                    ? "게임을 재시작"
                                    : "방장을 게임을 시작하길 기다리는 중"}
                            </ModalBody>
                            <ModalFooter>
                                {room.master === player.name ? (
                                    <Button onClick={() => resetBoard()}>
                                        재시작
                                    </Button>
                                ) : null}
                                <Button onClick={() => exitRoom()}>
                                    나가기
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            </StatusSection>
        </>
    );
};
