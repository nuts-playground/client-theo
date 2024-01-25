"use client";
import { PlayerList } from "@/components/playerList";
import { Join } from "@/components/join";
import { useAppSelector } from "./redux/hook";
import { selectPlayer } from "./redux/playerSlice";
import StatusSection from "@/components/statusSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Home() {
    const player = useAppSelector(selectPlayer);
    return (
        <div className="flex justify-between h-full">
            <div className="flex flex-col justify-center mr-10">
                <p className="mb-6 text-5xl font-bold leading-tight tracking-tight">
                    Play games with other people in{" "}
                    <span className="text-blue-600">real time</span> at Theo
                    Playground
                </p>
                <p className="flex space-x-1 mb-4 text-gray-400">
                    <span>제작자:</span>
                    <Link
                        className="hover:text-white transition"
                        href="https://portfolio.mynameishomin.com/"
                        target="_blank"
                    >
                        테오&lt;My name is homin&gt;
                    </Link>
                </p>
                {player.id ? (
                    <div>
                        <Link
                            className="flex items-center space-x-2 hover:underline"
                            href="/games"
                        >
                            게임 확인하기
                            <FontAwesomeIcon
                                className="mt-1 ml-2"
                                icon={faAngleRight}
                            />
                        </Link>
                    </div>
                ) : (
                    <Join />
                )}
            </div>
            <StatusSection title="접속중인 플레이어">
                <PlayerList />
            </StatusSection>
        </div>
    );
}
