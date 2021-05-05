import { pocket } from "@/utils/utils";

export async function getAllBoards() {
    const response = await pocket.get("board/boardlist/");
    return response.data;
}

export async function addNewBoard(boardName) {
    const response = await pocket.post("board/addboard/", {
        board_name: boardName,
    });
    return response.data;
}

export async function deleteBoard(boardId) {
    const response = await pocket.delete("board/deleteboard/", {
        board_id: boardId,
    });
    return response.data;
}
