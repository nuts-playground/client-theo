import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

interface IPopoverButton {
    condition: boolean;
    buttonText: string;
    popoverTitle: string;
    popoverText: string;
    size?: "lg" | "sm" | "md" | undefined;
    radius?: "lg" | "sm" | "md" | "none" | "full" | undefined;
    type: "button" | "reset" | "submit" | undefined;
    onClick?(): () => void;
}

export default ({
    condition,
    onClick,
    buttonText,
    popoverTitle,
    popoverText,
    type,
    size,
    radius,
}: IPopoverButton) => {
    return (
        <>
            {condition ? (
                <Button
                    className="w-full"
                    type={type}
                    color="primary"
                    size={size}
                    radius={radius}
                    onPress={onClick}
                >
                    {buttonText}
                </Button>
            ) : (
                <Popover>
                    <PopoverTrigger>
                        <Button
                            className="w-full"
                            type={type}
                            color="primary"
                            size={size}
                            radius={radius}
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
