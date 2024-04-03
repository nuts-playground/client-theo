"use client";
import { Card, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";

export const GameCard = () => {
    return (
        <Link href="/games/tictactoe">
            <Card isFooterBlurred radius="lg" className="border-none">
                <Image
                    alt="틱택토"
                    className="object-cover"
                    height={200}
                    src="/images/tic-tac-toe.png"
                    width={200}
                />
                <CardFooter className="justify-center border-white/20 border-1 py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-center">틱택토</p>
                </CardFooter>
            </Card>
        </Link>
    );
};
