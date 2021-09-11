import * as yup from "yup";

export function validateLibEditorFormData(data) {
    const schema = yup.object({
        board: yup.string().required(),
        klass: yup.string().required(),
        subject: yup.string().required(),
        chapter: yup.string().required(),
        topic: yup.array().min(1).required(),
        marks: yup.string().required(),
        question_cat: yup.string().required(),
        hasOption: yup.boolean().required(),
    });

    return schema.isValidSync(data);
}

export function validateCsvData(data) {
    const schema = yup.object({
        Name: yup.string().required(),
        Mobile: yup.string().required(),
        Email: yup.string().required().email(),
    });

    // Validate Details Object
    const isEveryDataValidate = data.every((ele) => schema.isValidSync(ele));
    return isEveryDataValidate;
}

export function validatePaperForm(payload) {
    const schema = yup.object({
        board: yup.string().required(),
        class: yup.string().required(),
        class_id: yup.string().required(),
        section: yup.string().required(),
        subjectList: yup.array().of(yup.string()).required().min(1),
        topicList: yup.array().of(yup.string()).required().min(1),
        config: yup.object({
            name: yup.string().required(),
            submissionTime: yup.string().required(),
            questionType: yup.string().required(),
            paperType: yup.string().required(),
            paperRejoin: yup.string().required(),
            examType: yup.string().required(),
            totalMarks: yup.string().required(),
            testType: yup.string().required(),
            duration: yup.string().required(),
            numberOfQuestions: yup.string().required(),
            startTime: yup.string().required(),
            endTime: yup.string().required(),
            datetime: yup.string().required(),
        }),
        teacherId: yup.string().required(),
        studentId: yup.array(),
    });
    return !schema.isValidSync(payload);
}

export function validateQuestion(question, paper, list) {
    const { text, config, options } = question;

    const errors = [];

    //check if  question text is entered
    if (text.length === 0 || text === "<p><br></p>") {
        errors.push("Please enter question");
    }

    //validate config object
    for (const [key, value] of Object.entries(config)) {
        switch (key) {
            case "time": {
                if (value.length === 0) {
                    errors.push("Please enter time");
                }
                break;
            }
            case "marks": {
                if (value.length === 0) {
                    errors.push("Please enter marks");
                }
                break;
            }
            case "cat": {
                if (value.length === 0) {
                    errors.push("Please enter category");
                }
                break;
            }
            case "type": {
                if (value.length === 0) {
                    errors.push("Please enter type");
                }
                break;
            }
            case "pdf": {
                if (value.length === 0) {
                    errors.push("Please enter pdf link");
                }
                break;
            }
            case "video": {
                if (value.length === 0) {
                    errors.push("Please endter video link");
                }
                break;
            }
            case "subjectId": {
                if (value.length === 0) {
                    errors.push("Please select subject");
                }
                break;
            }
            case "courseId": {
                if (value.length === 0) {
                    errors.push("Please select topic");
                }
                break;
            }
        }
    }

    if (paper.config.paperType === "Quizo") {
        //check if text is enterd in options
        options.forEach((ele) => {
            if (ele.length === 0) {
                errors.push("Please enter option");
            }
        });

        //check if all the status are false
        if (options.every((ele) => !ele.status)) {
            errors.push("Please select any one option");
        }
    }

    //check for total length of question list
    if (list.length >= Number(paper.config.numberOfQuestions)) {
        errors.push("Number of question exceed");
    }

    //validate total marks
    const currentTotalMarks = list.reduce((acc, curr) => acc + Number(curr.config.marks), 0);
    if (Number(config.marks) + currentTotalMarks > Number(paper.config.totalMarks)) {
        errors.push("Total Marks exceed");
    }

    //validate total time
    const currentTotalTime = list.reduce((acc, curr) => acc + Number(curr.config.time), 0);
    if (Number(config.time) + currentTotalTime > Number(paper.config.duration)) {
        errors.push("Total Time exceed");
    }

    return errors;
}
