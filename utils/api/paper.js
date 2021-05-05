import { pocket } from "@/utils/utils";
import axios from "axios";

export async function uploadPdfPaper({ paper, file }) {
    let response1;

    if (process.env.NODE_ENV === "development") {
        response1 = await axios.get("http://localhost:3000/api/getSignUrl");
    } else {
        response1 = await axios.get("https://classinpocket-admin.vercel.app/api/getSignUrl");
    }

    const bucketUrl = `https://cipteststorage.s3.ap-south-1.amazonaws.com/${response1.data.key}`;

    await axios.put(response1.data.url, file);

    const paperWithUrl = { ...paper, pdf: { ...paper.pdf, paper_pdf: bucketUrl } };

    const response2 = await pocket.post("paper/addpaper/", paperWithUrl);

    return response2;
}

export async function updatePaper({ paperId, paperName, startTime, endTime, submissionTime }) {
    const response = await pocket.put("paper/editpaper/", {
        paper_id: paperId,
        paper_name: paperName,
        start_time: startTime,
        end_time: endTime,
        submission_time: submissionTime,
    });

    return response.data;
}

export async function getFilterPaperList({ boardId, classId, subjectId, courseId, batchId }) {
    const response = await pocket.post("paper/filter/paperlist/", {
        board_id: boardId,
        class_id: classId,
        batch_id: batchId,
        subject_id: subjectId,
        course_id: courseId,
    });

    return response.data;
}

export async function deletePaper(paperId) {
    const response = await pocket.delete(`paper/${paperId}`);
    return response.data;
}

export async function assignCopy({
    boardId,
    classId,
    batchId,
    subjectId,
    courseId,
    paperId,
    studentId,
    teacherId,
    copyId,
}) {
    const response = await pocket.put("copies/assign/sharedcopies", {
        board_id: boardId,
        class_id: classId,
        batch_id: batchId,
        subject_id: subjectId,
        course_id: courseId,
        paper_id: paperId,
        student_id: studentId,
        teacher_id: teacherId,
        copy_id: copyId,
    });

    return response.data;
}

export async function getUnAssignCopies({ boardId, classId, batchId, subjectId, courseId }) {
    const response = await pocket.post("copies/user/copieslist", {
        board_id: boardId,
        class_id: classId,
        batch_id: batchId,
        subject_id: subjectId,
        course_id: courseId,
    });
    return response.data;
}

export async function getPaperList() {
    const response = await pocket.get("paper/paperlist");
    return response.data;
}

export async function getUsersById({ classId, subjectId, boardId, batchId }) {
    if (Array.isArray(subjectId)) {
        const promises = subjectId.map((value) => {
            return pocket.post("paper/user/userlist/", {
                board_id: boardId,
                class_id: classId,
                batch_id: batchId,
                subject_id: value,
            });
        });

        const result = await Promise.all(promises);

        const userList = {
            teacherlist: [],
            studentlist: [],
        };

        result.forEach((value, i) => {
            if (value.data.status) {
                if (i === 0) {
                    userList.teacherlist = [...value.data.data.teacherlist];
                    userList.studentlist = [...value.data.data.studentlist];
                } else {
                    const {
                        data: { teacherlist, studentlist },
                    } = value.data;

                    studentlist.forEach((el) => {
                        const foundStudent = userList.studentlist.find((value) => value.user_id === el.user_id);

                        if (!foundStudent) {
                            userList.studentlist.push(el);
                        }
                    });

                    teacherlist.forEach((el) => {
                        const foundTeacher = userList.teacherlist.find((value) => value.user_id === el.user_id);

                        if (!foundTeacher) {
                            userList.teacherlist.push(el);
                        }
                    });
                }
            }
        });

        return userList;
    } else {
        throw new Error("subjectId is not array of ids");
    }
}

export async function addNewPaper(body) {
    const response = await pocket.post("paper/addpaper/", body);
    return response.data;
}
