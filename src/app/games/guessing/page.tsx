"use client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useAppSelector } from "../../redux/hook";
import { selectRoom } from "@/app/redux/roomSlice";
import { RoomList } from "@/components/roomList";
import { Room } from "@/components/room";
import { useForm } from "react-hook-form";
import { selectSocket } from "@/app/redux/socketSlice";
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
import { Game, GuessingData } from "@/types";
import { useState } from "react";

const game: Game = {
    name: "guessing",
    maxPlayers: 4,
    minPlayers: 2,
};
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

export default () => {
    const room = useAppSelector(selectRoom);

    return (
        <>
            <GameSection>
                <section className="grow mr-12">
                    <SubmitAnswerOrQuestion />
                    {room.isStart ? (
                        <div>
                            <GuessingBoard
                                gameData={room.gameData as GuessingData}
                            />
                        </div>
                    ) : null}
                </section>
            </GameSection>
            <StatusSection title="스무고개">
                {room.id ? (
                    <Room />
                ) : (
                    <RoomList
                        game={game}
                        initGameData={
                            {
                                answer: "",
                                history: [] as unknown,
                            } as GuessingData
                        }
                    />
                )}
            </StatusSection>
        </>
    );
};

const SubmitAnswerOrQuestion = () => {
    type Actions = "answer" | "question" | "";
    const [action, setAction] = useState<Actions>("");
    const socket = useAppSelector(selectSocket);

    const submitAnswer = (input: string) => {
        socket.emit("submitAnswer", input);
    };
    const submitQuestion = (input: string) => {
        socket.emit("submitQuestion", input);
    };

    return (
        <div>
            {action ? null : (
                <ButtonGroup>
                    <Button onClick={() => setAction("question")}>질문</Button>
                    <Button onClick={() => setAction("answer")} color="primary">
                        정답
                    </Button>
                </ButtonGroup>
            )}

            {action === "answer" ? (
                <SubmitForm
                    onSubmit={submitAnswer}
                    labelText="정답을 작성해주세요."
                    buttonText="제출"
                />
            ) : null}
            {action === "question" ? (
                <SubmitForm
                    onSubmit={submitQuestion}
                    labelText="질문을 작성해주세요."
                    buttonText="제출"
                />
            ) : null}
        </div>
    );
};

interface TypeSubmitForm {
    onSubmit: (input: string) => void;
    labelText: string;
    buttonText: string;
}
const SubmitForm = ({ onSubmit, labelText, buttonText }: TypeSubmitForm) => {
    const { register, handleSubmit, watch } = useForm();

    const submit = () => {
        onSubmit(watch("input"));
    };

    return (
        <form className="flex items-end" onSubmit={handleSubmit(submit)}>
            <Input
                className="mb-2 sm:mb-0"
                color="primary"
                label={labelText}
                variant="underlined"
                size="sm"
                {...register("input")}
            />
            <Button
                className="w-full sm:w-20"
                size="sm"
                type="submit"
                isDisabled={!Boolean(watch("input"))}
                color={!Boolean(watch("input")) ? "default" : "primary"}
            >
                {buttonText}
            </Button>
        </form>
    );
};

const CreateQuestion = () => {
    const socket = useAppSelector(selectSocket);

    const registerAnswer = (input: string) => {
        socket.emit("registerAnswer", input);
    };

    return (
        <SubmitForm
            onSubmit={registerAnswer}
            labelText="문제를 출제해주세요."
            buttonText="제출"
        />
    );
};

const GuessingBoard = ({ gameData }: { gameData: GuessingData }) => {
    const room = useAppSelector(selectRoom);
    const player = useAppSelector(selectPlayer);
    const isMaster = room.master === player.name;
    const { register, handleSubmit, watch, setValue } = useForm();

    console.log(room);

    return (
        <div>
            {gameData.answer ? (
                <div>
                    <h2 className="flex items-end mb-2 text-xl">
                        <span className="mr-auto">진행 상황</span>
                        {isMaster ? (
                            <span className="text-base">
                                정답: {gameData.answer}
                            </span>
                        ) : null}
                    </h2>

                    <Table className="mb-8">
                        <TableHeader>
                            <TableColumn>번호</TableColumn>
                            <TableColumn>질문</TableColumn>
                            <TableColumn>답변</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {gameData.history.map((item, index) => {
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
                    {!isMaster ? (
                        <SubmitAnswerOrQuestion />
                    ) : (
                        "상대방이 입력중입니다."
                    )}

                    <ButtonGroup>
                        <Button>예</Button>
                        <Button>아니오</Button>
                    </ButtonGroup>
                </div>
            ) : isMaster ? (
                <CreateQuestion />
            ) : (
                "방장이 문제를 출제 중입니다."
            )}
        </div>
    );
};
