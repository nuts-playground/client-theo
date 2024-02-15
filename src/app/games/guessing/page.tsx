"use client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useAppSelector } from "../../redux/hook";
import { selectRoom } from "@/app/redux/roomSlice";
import { RoomList } from "@/components/roomList";
import { Room } from "@/components/room";
import { useForm } from "react-hook-form";

import {
    Input,
    ButtonGroup,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import { selectPlayer } from "@/app/redux/playerSlice";

const GAME_NAME = "guessing";
//임시 게임 데이터
const gameData = [
    {
        question: "사람인가요?",
        answer: true,
    },
    {
        question: "여자인가요?",
        answer: true,
    },
    {
        question: "50대 이하인가요?",
        answer: false,
    },
    {
        question: "살아계신가요?",
        answer: true,
    },
];

interface GuessingData {
    answer: string;
    history: [
        {
            question: string;
            answer: boolean;
        }
    ];
}

export default () => {
    const room = useAppSelector(selectRoom);
    const player = useAppSelector(selectPlayer);
    const { register, handleSubmit, watch, setValue } = useForm();

    return (
        <>
            <GameSection>
                <section className="grow mr-12">
                    <h2 className="mb-2 text-xl">진행 상황</h2>
                    <Table className="mb-8">
                        <TableHeader>
                            <TableColumn>번호</TableColumn>
                            <TableColumn>질문</TableColumn>
                            <TableColumn>답변</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {gameData.map((item, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index}</TableCell>
                                        <TableCell>{item.question}</TableCell>
                                        <TableCell>{item.answer}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <form className="flex items-end">
                        <Input
                            className="mb-2 sm:mb-0"
                            color="primary"
                            label="정답"
                            variant="underlined"
                            size="sm"
                            {...register("answer")}
                        />
                        <Button
                            className="w-full sm:w-20"
                            size="sm"
                            type="submit"
                            isDisabled={!Boolean(watch("answer"))}
                            color={
                                !Boolean(watch("answer"))
                                    ? "default"
                                    : "primary"
                            }
                        >
                            제출
                        </Button>
                    </form>

                    <ButtonGroup>
                        <Button>예</Button>
                        <Button>아니오</Button>
                    </ButtonGroup>
                </section>
            </GameSection>
            <StatusSection title="스무고개">
                {room.id ? <Room /> : <RoomList game={GAME_NAME} />}
            </StatusSection>
        </>
    );
};
