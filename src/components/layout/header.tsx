import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Avatar,
} from "@nextui-org/react";
import Link from "next/link";
import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectJoinModal } from "@/app/redux/joinModalSlice";
import { Nav } from "@/components/layout/nav";
import { Join } from "@/components/join";

const JoinModalButton = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const player = useAppSelector(selectPlayer);

    return (
        <>
            <Button color="primary" radius="full" onClick={onOpen}>
                JOIN
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Theo playground
                    </ModalHeader>
                    <ModalBody>
                        <Join />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export const Header = () => {
    const player = useAppSelector(selectPlayer);
    const joinModal = useAppSelector(selectJoinModal);
    return (
        <header className="flex px-6 w-full h-16 mb-5 items-center justify-between max-w-screen-xl">
            <h1 className="text-2xl">
                <Link href="/">THEO PLAYGROUND</Link>
            </h1>
            <Nav />

            <div>
                {player.id ? (
                    <Link href="/my">
                        <Avatar
                            className="text-nowrap"
                            name={player.name}
                            color="secondary"
                            size="sm"
                            isBordered
                        />
                    </Link>
                ) : (
                    <JoinModalButton />
                )}
            </div>
        </header>
    );
};
