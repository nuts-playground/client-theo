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
import { selectPlayer } from "@/app/redux/playerSlice";

export const PlayerList = () => {
    const players = useAppSelector(selectPlayers);
    const player = useAppSelector(selectPlayer);
    return (
        <Listbox
            className="mb-2 gap-0 bg-content1 max-w-full overflow-visible shadow-small rounded-medium"
            aria-label="Actions"
            emptyContent="현재 접속중인 플레이어가 없습니다."
        >
            {players.map((playerItem) => {
                return (
                    <ListboxItem key={playerItem.id}>
                        {playerItem.id === player.id ? (
                            <User
                                className="w-full justify-start"
                                name={`${playerItem.name}`}
                                description={`위치: ${playerItem.location}`}
                            />
                        ) : (
                            <Popover showArrow placement="bottom">
                                <PopoverTrigger>
                                    <User
                                        className="w-full justify-start"
                                        name={`${playerItem.name}`}
                                        description={`위치: ${playerItem.location}`}
                                    />
                                </PopoverTrigger>
                                <PopoverContent className="p-1">
                                    <ButtonGroup>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="sm"
                                        >
                                            따라가기
                                        </Button>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="sm"
                                        >
                                            메시지 보내기
                                        </Button>
                                    </ButtonGroup>
                                </PopoverContent>
                            </Popover>
                        )}
                    </ListboxItem>
                );
            })}
        </Listbox>
    );
};
