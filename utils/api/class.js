import { pocket } from "@/utils/utils";

export async function getClassByBoardId({ boardId }) {
    const response = await pocket.get(`class/${boardId}/`);
    return response.data;
}

export async function getAllClasses() {
    const response = await pocket.get("class/classlist/");
    return response.data;
}

export async function addNewClass({ className, boardId }) {
    const response = await pocket.post("class/addclass/", {
        class_name: className,
        board_id: boardId,
    });
    return response.data;
}

export async function deleteClass(classId) {
    const response = await pocket.delete(`class/${classId}/`);
    return response.data;
}
