import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

interface IPopoverButton {
    condition: Boolean;
    onClick: () => void;
    buttonText: String;
    popoverTitle: String;
    popoverText: String;
}

export default ({
    condition,
    onClick,
    buttonText,
    popoverTitle,
    popoverText,
}: IPopoverButton) => {
    return (
        <>
            {condition ? (
                <Button
                    type="button"
                    color="primary"
                    size="lg"
                    onPress={onClick}
                >
                    {buttonText}
                </Button>
            ) : (
                <Popover>
                    <PopoverTrigger>
                        <Button type="button" color="primary" size="lg">
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
