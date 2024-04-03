"use client";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    useDisclosure,
} from "@nextui-org/react";

export const RoomList = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    방 생성
                </ModalHeader>
                <ModalBody className="pt-0 pb-6">
                    <form className="flex items-end">
                        <Input
                            color="primary"
                            label="방 제목"
                            placeholder="나랑 한 판 붙자!"
                            size="sm"
                            variant="underlined"
                        />

                        <Button className="sm:w-20" size="sm" type="submit">
                            만들기
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
