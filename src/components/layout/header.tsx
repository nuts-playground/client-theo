import { Button } from "@nextui-org/react";
import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { JoinModal } from "../joinModal";
import { selectJoinModal } from "@/app/redux/joinModalSlice";
import { Nav } from "@/components/layout/nav";

export const Header = () => {
    const player = useAppSelector(selectPlayer);
    const joinModal = useAppSelector(selectJoinModal);
    return (
        <header className="flex justify-between items-center">
            <Nav />

            <div>
                {player.id ? null : (
                    <>
                        <Button
                            color="primary"
                            onClick={() => joinModal.onOpen()}
                        >
                            JOIN
                        </Button>
                    </>
                )}
            </div>
            <JoinModal />
        </header>
    );
};
