import { pocket } from "@/utils/utils";

export async function getSubjectById({ boardId, classId, batchId }) {
    const response = await pocket.get(`subject/${boardId}/${classId}/${batchId}/`);
    return response.data;
}

export async function getAllSubjects() {
    const response = await pocket.get("subject/subjectlist/");
    return response.data;
}

export async function addNewSubject({ subjectName, boardId, classId, batchId }) {
    const response = await pocket.post("subject/addsubject/", {
        board_id: boardId,
        class_id: classId,
        batch_id: batchId,
        subject_name: subjectName,
    });

    return response.data;
}

export async function deleteSubject(subjectId) {
    const response = await pocket.delete(`subject/${subjectId}/`);
    return response.data;
}
