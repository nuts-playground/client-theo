import GameSection from "@/components/gameSection";
import GameList from "@/components/gameList";
import StatusSection from "@/components/statusSection";

export default function Home() {
    return (
        <>
            <GameSection>
                <GameList />
            </GameSection>
            <StatusSection>
                <div>
                    <div>
                        {/* <FontAwesomeIcon icon={faUsers} /> */}
                        방문자
                    </div>
                </div>
            </StatusSection>
        </>
    );
}
