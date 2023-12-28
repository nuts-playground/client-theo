import GameBoard from "@/components/gameBoard";
import GameList from "@/components/gameList";
import StatusBoard from "@/components/statusBoard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    return (
        <>
            <GameBoard>
                <GameList />
            </GameBoard>
            <StatusBoard>
                {/* <div>
                    <div>
                        <FontAwesomeIcon icon={faUsers} />
                        방문자
                    </div>
                </div> */}
            </StatusBoard>
        </>
    );
}
