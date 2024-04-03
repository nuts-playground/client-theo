import { GameCard } from "@/components/game-card";

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <GameCard />
        </section>
    );
}
