import axios from "axios";

let url = process.env.NEXT_PUBLIC_API_URI;

export const pocket = axios.create({ baseURL: url });

export function generatePaper({ paper, questions }) {
    const paperGen = {
        board: paper.board,
        class_name: paper.class,
        class_id: paper.class_id,
        section: paper.section,
        subject_list: paper.subjectList,
        topic_list: paper.topicList,
        paper_name: paper.config.name,
        start_time: paper.config.startTime,
        end_time: paper.config.endTime,
        submission_time: Number(paper.config.submissionTime),
        paper_total_marks: Number(paper.config.totalMarks),
        paper_rejoin: Number(paper.config.paperRejoin),
        paper_type: paper.config.paperType,
        question_type: paper.config.questionType,
        exam_type: paper.config.examType,
        student_id: paper.studentId,
        teacher_id: paper.teacherId,
        test_type: paper.config.testType,
        questions: questions.map((question) => {
            return {
                subject: question.config.subjectId,
                topics: question.config.courseId,
                question_cate: question.config.cat,
                question_time: Number(question.config.time),
                question_marks: Number(question.config.marks),
                question_pdf_solution: question.config.pdf,
                question_video_solution: question.config.video,
                question: {
                    text: question.text,
                    option_type: question.config.type,
                },
                question_options: question.options.map(({ text, status }) => ({ value: status, text: text })),
            };
        }),
    };

    return paperGen;
}

export async function openFile() {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.addEventListener(
            "change",
            () => {
                if (input.files != null) {
                    resolve(input.files[0]);
                }
            },
            true
        );
        input.click();
    });
}

export function Filter({ board = [], klass = [], batch = [], subject = [], course = [] }) {
    const list = {
        board,
        klass,
        batch,
        subject,
        course,
    };

    function getClasses(board) {
        if (typeof board === "string") {
            const tempClassList = list.klass.filter((el) => el.board_id === board);
            return tempClassList;
        }
    }

    function getBatches(klass) {
        if (typeof klass === "string") {
            const tempBatchList = list.batch.filter((el) => el.class_id === klass);
            return tempBatchList;
        }
    }

    function getSubjects(batch) {
        if (typeof batch === "string") {
            const tempSubjectList = list.subject.filter((el) => el.batch_id === batch);
            return tempSubjectList;
        }
    }

    function getCourses(subject) {
        if (typeof subject === "string") {
            const tempCourseList = list.course.filter((el) => el.subject_id === subject);
            return tempCourseList;
        } else if (Array.isArray(subject)) {
            let tempCourseList = [];

            subject.forEach((el1) => {
                let li = list.course.filter((el2) => el1 === el2.subject_id);
                tempCourseList.push(li);
            });

            return tempCourseList.flat();
        }
    }

    return { getClasses, getBatches, getSubjects, getCourses, list };
}

export function newFilter({ board = [], klass = [], batch = [], subject = [], course = [] }) {
    const list = {
        board,
        klass,
        batch,
        subject,
        course,
    };

    function getClasses(boardIds) {
        if (typeof boardIds === "string") {
            const tempClassList = list.klass.filter((el) => el.board_id === boardIds);
            return tempClassList;
        } else if (Array.isArray(boardIds)) {
            const tempClassList = [];

            boardIds.forEach((b) => {
                const li = list.klass.filter((el) => el.board_id === b);
                tempClassList.push(li);
            });

            return tempClassList.flat();
        }
    }

    function getBatches(klassIds) {
        if (typeof klassIds === "string") {
            const tempBatchList = list.batch.filter((el) => el.class_id === klassIds);
            return tempBatchList;
        } else if (Array.isArray(klassIds)) {
            const tempBatchList = [];

            klassIds.forEach((k) => {
                const li = list.batch.filter((el) => el.class_id === k);
                tempBatchList.push(li);
            });

            return tempBatchList.flat();
        }
    }

    function getSubjects(batchIds) {
        if (typeof batchIds === "string") {
            const tempSubjectList = list.subject.filter((el) => el.batch_id === batchIds);
            return tempSubjectList;
        } else if (Array.isArray(batchIds)) {
            const tempSubjectList = [];

            batchIds.forEach((b) => {
                const li = list.subject.filter((el) => el.batch_id === b);
                tempSubjectList.push(li);
            });

            return tempSubjectList.flat();
        }
    }

    function getCourses(subjectIds) {
        if (typeof subjectIds === "string") {
            const tempCourseList = list.course.filter((el) => el.subject_id === subjectIds);
            return tempCourseList;
        } else if (Array.isArray(subjectIds)) {
            const tempCourseList = [];

            subjectIds.forEach((el1) => {
                const li = list.course.filter((el2) => el1 === el2.subject_id);
                tempCourseList.push(li);
            });

            return tempCourseList.flat();
        }
    }

    return { getClasses, getBatches, getSubjects, getCourses, list };
}
