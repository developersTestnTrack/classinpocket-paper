export function genStudents({ student_credential_list, class_details, school_id }) {
    return student_credential_list.map((student) => {
        return {
            id: "",
            class_id: class_details.id,
            school_id: school_id,
            class: {
                status: class_details.status,
                id: class_details.id,
                class_name: class_details.class_name,
                section: class_details.section,
                board: class_details.board,
                subject_list: class_details.subject_list,
                action_status: class_details.action_status,
                created_date: class_details.created_date,
            },
            reg_number: Date.now(),
            login_id: student.Mobile,
            password: "12345",
            name: student.Name,
            mother_name: student.Mother_Name,
            father_name: student.Father_Name,
            mobile: student.Mobile,
            email: student.Email,
            image: "",
            gender: "",
            approved: true,
        };
    });
}

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
        questions: questions.map((question, i) => {
            return {
                question_no: i + 1,
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
