import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect } from "react";
import { Join } from "@/components/join";

export const JoinModal = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    useEffect(() => {
        // dispatch(
        //     setJoinModal({
        //         onOpen,
        //         onClose,
        //         onOpenChange,
        //     })
        // );
        onOpen();
    }, []);

    return (
        <>
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
