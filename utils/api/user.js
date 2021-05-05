import { pocket } from "@/utils/utils";

export async function getAllTeachers() {
    const response = await pocket.get("user/Teacher/");
    return response.data;
}

export async function getAllStudents() {
    const response = await pocket.get("user/Student/");
    return response.data;
}

export async function addNewUser(body) {
    const response = await pocket.post("user/adduser/", body);
    return response.data;
}

export async function updateUserStatus({ id, status }) {
    const response = await pocket.put("user/action/editstatus", { user_id: id, action_status: status });
    return response.data;
}

export async function deleteUser(id) {
    const response = await pocket.delete(`user/${id}/`);
    return response.data;
}
