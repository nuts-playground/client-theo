import {
    Avatar,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { Join } from "@/components/join";

const JoinModalButton = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

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
                    <ModalBody className="pb-4">
                        <Join />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export const Header = () => {
    const player = useAppSelector(selectPlayer);

    return (
        <Navbar maxWidth="xl">
            <NavbarContent justify="center">
                <NavbarBrand className="mr-4">
                    <Link className="text-white text-2xl" href="/">
                        THEO PLAYGROUND
                    </Link>
                </NavbarBrand>
                <NavbarItem key="Games">
                    <Link href="/games/tictactoe">Tic-tac-toe</Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
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
            </NavbarContent>
        </Navbar>
    );
};
