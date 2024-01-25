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
    Popover,
    PopoverTrigger,
    PopoverContent,
    useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { Join } from "@/components/join";
import Image from "next/image";

const JoinModalButton = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                    <Link className="hover:underline" href="/games">
                        Games
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {player.id ? (
                    <Popover showArrow placement="bottom">
                        <PopoverTrigger>
                            <Avatar
                                className="text-nowrap"
                                name={player.name}
                                color="secondary"
                                size="sm"
                                isBordered
                            />
                        </PopoverTrigger>
                        <PopoverContent className="p-1">
                            <div
                                data-slot="content"
                                data-open="true"
                                data-arrow="true"
                                className="z-10 w-full inline-flex flex-col items-center justify-center subpixel-antialiased outline-none box-border text-small bg-content1 rounded-large shadow-medium p-1"
                                data-placement="bottom"
                            >
                                <div className="flex flex-col relative overflow-hidden height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-none rounded-large transition-transform-background motion-reduce:transition-none max-w-[300px] border-none bg-transparent">
                                    <div className="flex p-3 z-10 w-full items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large justify-between">
                                        <div className="flex gap-3">
                                            <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-default text-default-foreground rounded-full ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark ring-default">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src="/"
                                                    className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-0 data-[loaded=true]:opacity-100"
                                                    alt="avatar"
                                                    data-loaded="true"
                                                />
                                            </span>
                                            <div className="flex flex-col items-start justify-center">
                                                <h4 className="text-small font-semibold leading-none text-default-600">
                                                    Zoey Lang
                                                </h4>
                                                <h5 className="text-small tracking-tight text-default-500">
                                                    @zoeylang
                                                </h5>
                                            </div>
                                        </div>
                                        <button
                                            className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-3 min-w-unit-16 h-unit-8 text-tiny gap-unit-2 rounded-full [&amp;>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover"
                                            type="button"
                                        >
                                            Follow
                                        </button>
                                    </div>
                                    <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased px-3 py-0">
                                        <p className="text-small pl-px text-default-500">
                                            Full-stack developer, @getnextui
                                            lover she/her{" "}
                                            <span
                                                aria-label="confetti"
                                                role="img"
                                            >
                                                🎉
                                            </span>
                                        </p>
                                    </div>
                                    <div className="p-3 h-auto flex w-full items-center overflow-hidden color-inherit subpixel-antialiased rounded-b-large gap-3">
                                        <div className="flex gap-1">
                                            <p className="font-semibold text-default-600 text-small">
                                                4
                                            </p>
                                            <p className=" text-default-500 text-small">
                                                Following
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <p className="font-semibold text-default-600 text-small">
                                                97.1K
                                            </p>
                                            <p className="text-default-500 text-small">
                                                Followers
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <JoinModalButton />
                )}
            </NavbarContent>
        </Navbar>
    );
};
