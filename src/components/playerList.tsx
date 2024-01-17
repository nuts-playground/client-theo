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
        <section>
            <h3 className="mb-1 pl-1 text-xl font-bold">Online players</h3>
            <Listbox
                className="mb-2 gap-0 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="There are no players currently online."
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
        </section>
    );
};
