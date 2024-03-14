import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
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
import { useState } from "react";

export const site = {
    title: "THEO PLAYGROUND",
    author: {
        name: "My name is homin",
        alias: "테오",
        url: "https://portfolio.mynameishomin.com/",
    },
    description:
        "테오 플레이그라운드에 놀러 오신 것을 환영합니다. 이곳에서는 다른 사람들과 실시간으로 다양한 게임을 즐기실 수 있습니다.",
};

const menuArray = [{ title: "Games", url: "/games" }];

const JoinModalButton = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className="hidden sm:flex">
            <Button color="primary" radius="full" onClick={onOpen}>
                입장
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        {site.title}
                    </ModalHeader>
                    {/* <ModalBody className="pb-4">
                        <Join />
                    </ModalBody> */}
                </ModalContent>
            </Modal>
        </div>
    );
};

export const Header = () => {
    const player = useAppSelector(selectPlayer);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <Navbar
            maxWidth="xl"
            onMenuOpenChange={setIsMenuOpen}
            position="sticky"
        >
            <NavbarContent className="sm:hidden">
                <NavbarBrand className="mr-4 sm:hidden">
                    <Link className="text-white text-2xl spacingUnit" href="/">
                        {site.title}
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex" justify="center">
                <NavbarBrand className="mr-4">
                    <Link className="text-white text-2xl" href="/">
                        {site.title}
                    </Link>
                </NavbarBrand>
                <NavbarMenu>
                    {menuArray.map((menu, index) => {
                        return (
                            <NavbarMenuItem key={index}>
                                <Link
                                    className="hover:underline"
                                    href={menu.url}
                                >
                                    {menu.title}
                                </Link>
                            </NavbarMenuItem>
                        );
                    })}
                </NavbarMenu>

                {menuArray.map((menu, index) => {
                    return (
                        <NavbarItem key={index}>
                            <Link className="hover:underline" href={menu.url}>
                                {menu.title}
                            </Link>
                        </NavbarItem>
                    );
                })}
            </NavbarContent>
            <NavbarContent justify="end">
                {player.id ? null : <JoinModalButton />}
                <NavbarMenuToggle
                    className="sm:hidden"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>
        </Navbar>
    );
};
