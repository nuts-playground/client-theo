import {
    Listbox,
    ListboxItem,
    Popover,
    PopoverTrigger,
    User,
    PopoverContent,
    ButtonGroup,
    Button,
} from "@nextui-org/react";
import { useAppSelector } from "@/app/redux/hook";
import { selectPlayers } from "@/app/redux/playersSlice";

export const PlayerList = () => {
    const players = useAppSelector(selectPlayers);
    return (
        <Listbox
            className="mb-2 gap-0 bg-content1 max-w-full overflow-visible shadow-small rounded-medium"
            aria-label="Actions"
            emptyContent="현재 접속중인 플레이어가 없습니다."
        >
            {players.map((player) => {
                return (
                    <ListboxItem key={player.id}>
                        <Popover showArrow placement="bottom">
                            <PopoverTrigger>
                                <User
                                    className="w-full justify-start"
                                    name={`${player.name}`}
                                    description={`Location: ${player.location}`}
                                />
                            </PopoverTrigger>
                            <PopoverContent className="p-1">
                                <ButtonGroup>
                                    <Button
                                        color="primary"
                                        type="button"
                                        size="sm"
                                    >
                                        Join the room
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="button"
                                        size="sm"
                                    >
                                        Send message
                                    </Button>
                                </ButtonGroup>
                            </PopoverContent>
                        </Popover>
                    </ListboxItem>
                );
            })}
        </Listbox>
    );
};
