import { IPlayer } from "@/interface/interface";
import { IGameCell } from "@/components/gameBoard";

export const test = {};
export const tictactoeCheckGameOver = (
    marker: string,
    player: IPlayer,
    boardData: IGameCell[][]
) => {
    const lineArray = [
        // 가로 3줄
        [boardData[0][0], boardData[0][1], boardData[0][2]],
        [boardData[1][0], boardData[1][1], boardData[1][2]],
        [boardData[2][0], boardData[2][1], boardData[2][2]],
        // 세로 3줄
        [boardData[0][0], boardData[1][0], boardData[2][0]],
        [boardData[0][1], boardData[1][1], boardData[2][1]],
        [boardData[0][2], boardData[1][2], boardData[2][2]],
        // 대각선 2줄
        [boardData[0][0], boardData[1][1], boardData[2][2]],
        [boardData[0][2], boardData[1][1], boardData[2][0]],
    ];
    for (let i = 0; i < lineArray.length; i++) {
        console.log(lineArray[i]);
        if (lineArray[i].every((item) => item.player === marker)) {
            return player.name;
        }
    }

    let cellArray = boardData.reduce(function (
        prev: IGameCell[],
        next: IGameCell[]
    ) {
        return prev.concat(next);
    });

    if (cellArray.every((cell: IGameCell) => cell.value)) {
        return "drow";
    }

    return "";
};
