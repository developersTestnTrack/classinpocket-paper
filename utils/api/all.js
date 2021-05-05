import { pocket } from "@/utils/utils";

export async function getAllPapers() {
    const response = await pocket.get("paper/paperlist");

    if (response.data.status) {
        return response.data.data;
    } else {
        throw new Error(response.data.msg);
    }
}

export async function getAllListing() {
    const response = await pocket.get("all/getalllist/");

    return response.data;
}

export async function getName({ courseId, subjectId }) {
    const response = await pocket.post("all/getname/", {
        course_id: courseId,
        subject_id: subjectId,
    });

    return response.data;
}
