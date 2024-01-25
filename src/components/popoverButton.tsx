import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

interface IPopoverButton {
    condition: Boolean;
    onClick?(): () => void;
    buttonText: String;
    popoverTitle: String;
    popoverText: String;
    type: "button" | "reset" | "submit" | undefined;
}

export default ({
    condition,
    onClick,
    buttonText,
    popoverTitle,
    popoverText,
    type,
}: IPopoverButton) => {
    return (
        <>
            {condition ? (
                <Button
                    type={type}
                    color="primary"
                    size="lg"
                    className="h-full"
                    radius="full"
                    onPress={onClick}
                >
                    {buttonText}
                </Button>
            ) : (
                <Popover>
                    <PopoverTrigger>
                        <Button
                            type={type}
                            color="primary"
                            size="lg"
                            className="h-full"
                            radius="full"
                        >
                            {buttonText}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="px-1 py-2">
                            <div className="text-small font-bold">
                                {popoverTitle}
                            </div>
                            <div className="text-tiny">{popoverText}</div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </>
    );
};
