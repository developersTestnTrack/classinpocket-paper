import { pocket } from "@/utils/utils";

export async function getCourseByIdArray({ boardId, classId, batchId, subjectId }) {
    if (Array.isArray(subjectId)) {
        const promises = subjectId.map((value) => {
            return pocket.get(`course/${boardId}/${classId}/${batchId}/${value}`);
        });

        const result = await Promise.all(promises);

        const arr = result.map((response) => {
            if (response.data.status) {
                return response.data.data;
            }
        });

        return { status: true, data: arr.flat() };
    } else {
        throw new Error("subjectId is not array of ids");
    }
}

export async function getCourseById({ boardId, classId, batchId, subjectId }) {
    const response = await pocket.get(`course/${boardId}/${classId}/${batchId}/${subjectId}`);
    return response.data;
}

export async function getAllCourses() {
    const response = await pocket.get("course/courselist/");
    return response.data;
}

export async function addNewCourse({ courseName, boardId, classId, batchId, subjectId }) {
    const response = await pocket.post("course/addcourse/", {
        board_id: boardId,
        class_id: classId,
        batch_id: batchId,
        subject_id: subjectId,
        course_name: courseName,
    });

    return response.data;
}

export async function deleteCourse(courseId) {
    const response = await pocket.delete(`course/${courseId}/`);
    return response.data;
}
