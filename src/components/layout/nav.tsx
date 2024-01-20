import {
    Avatar,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
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

export const Nav = () => {
    const player = useAppSelector(selectPlayer);

    return (
        <Navbar maxWidth="xl">
            <NavbarContent justify="center">
                <NavbarBrand>
                    <Link className="text-white text-2xl" href="/">
                        THEO PLAYGROUND
                    </Link>
                </NavbarBrand>
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                                endContent={<FontAwesomeIcon icon={faPerson} />}
                                radius="sm"
                                variant="light"
                            >
                                Features
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu className="w-[340px]">
                        <DropdownItem
                            key="autoscaling"
                            description="ACME scales apps to meet user demand, automagically, based on load."
                            startContent={<FontAwesomeIcon icon={faPerson} />}
                        >
                            Autoscaling
                        </DropdownItem>
                        <DropdownItem
                            key="usage_metrics"
                            description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                            startContent={<FontAwesomeIcon icon={faPerson} />}
                        >
                            Usage Metrics
                        </DropdownItem>
                        <DropdownItem
                            key="production_ready"
                            description="ACME runs on ACME, join us and others serving requests at web scale."
                            startContent={<FontAwesomeIcon icon={faPerson} />}
                        >
                            Production Ready
                        </DropdownItem>
                        <DropdownItem
                            key="99_uptime"
                            description="Applications stay on the grid with high availability and high uptime guarantees."
                            startContent={<FontAwesomeIcon icon={faPerson} />}
                        >
                            +99% Uptime
                        </DropdownItem>
                        <DropdownItem
                            key="supreme_support"
                            description="Overcome any challenge with a supporting team ready to respond."
                            startContent={<FontAwesomeIcon icon={faPerson} />}
                        >
                            +Supreme Support
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
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
