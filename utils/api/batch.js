import { pocket } from "@/utils/utils";

export async function getBatchById({ boardId, classId }) {
    const response = await pocket.get(`batch/${boardId}/${classId}`);
    return response.data;
}

export async function getAllBatches() {
    const response = await pocket.get("batch/batchlist/");
    return response.data;
}

export async function addNewBatches({ batchName, boardId, classId }) {
    const response = await pocket.post("batch/addbatch/", {
        batch_name: batchName,
        board_id: boardId,
        class_id: classId,
    });
    return response.data;
}

export async function deleteBatches(batchId) {
    const response = await pocket.delete(`batch/${batchId}/`);
    return response.data;
}
