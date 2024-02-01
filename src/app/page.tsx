"use client";
import { PlayerList } from "@/components/playerList";
import { Join } from "@/components/join";
import { useAppSelector } from "./redux/hook";
import { selectPlayer } from "./redux/playerSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { site } from "@/components/layout/header";

export default function Home() {
    const player = useAppSelector(selectPlayer);
    return (
        <div className="flex flex-col pt-10 lg:flex-row lg:pt-60">
            <div className="flex flex-col justify-center lg:w-2/3 lg:pr-10 lg:justify-start">
                <div className="mb-8 lg:mb-0">
                    <p className="text-2xl break-keep mb-4 font-bold leading-tight tracking-tight sm:mb-6 sm:text-4xl sm:leading-snug">
                        {site.description}
                    </p>
                    <p className="flex space-x-1 mb-4 text-xs text-gray-400 sm:text-base lg:mb-0">
                        <span>제작자:</span>
                        <Link
                            className="underline hover:text-white transition"
                            href={site.author.url}
                            target="_blank"
                        >
                            {site.author.alias}&lt;{site.author.name}&gt;
                        </Link>
                    </p>
                </div>
            </div>
            <div className="mb-20 space-y-20 sm:flex sm:items-start sm:space-y-0 sm:space-x-12 lg:flex-col lg:w-1/3 lg:space-x-0 lg:space-y-8">
                {player.id ? null : <Join />}
                <section className="w-full sm:grow">
                    <h2 className="mb-2">접속중인 플레이어</h2>
                    <PlayerList />
                </section>
            </div>
        </div>
    );
}
