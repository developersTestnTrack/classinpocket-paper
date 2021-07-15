import * as yup from "yup";

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

const configObjectValidate = (config) => {
    const errors = [];
    const configKeys = Object.keys(config);
    const configMustKeys = {
        name: "name",
        numberOfQuestions: "numberOfQuestions",
        paperRejoin: "paperRejoin",
        paperType: "paperType",
        questionType: "questionType",
        submissionTime: "submissionTime",
        testType: "testType",
        totalMarks: "totalMarks",
        examType: "examType",
        startTime: "startTime",
        endTime: "endTime",
        duration: "duration",
        datetime: "datetime",
    };

    if (!configKeys.every((ele) => Object.values(configMustKeys).includes(ele))) {
        return errors.push("must include all the important keys in config object");
    }

    for (const [key, value] of Object.entries(config)) {
        switch (key) {
            case configMustKeys.name: {
                if (typeof value !== "string") {
                    errors.push("paper name should be string");
                } else {
                    if (value.length === 0) errors.push("paper name should not empty");
                }
                break;
            }
            case configMustKeys.numberOfQuestions: {
                if (typeof value !== "string") {
                    errors.push("number of question should be string");
                } else {
                    if (value.length === 0) errors.push("number of quesions should not be empty");
                }
                break;
            }
            case configMustKeys.paperRejoin: {
                if (typeof value !== "string") {
                    errors.push("paper rejoin should be string");
                } else {
                    if (value.length === 0) errors.push("paper rejoin should not be empty");
                }
                break;
            }
            case configMustKeys.questionType: {
                if (typeof value !== "string") {
                    errors.push("question type should be string");
                } else {
                    if (value.length === 0) errors.push("question type should not be empty");
                }
                break;
            }
            case configMustKeys.submissionTime: {
                if (typeof value !== "string") {
                    errors.push("submission time should be string");
                } else {
                    if (value.length === 0) errors.push("submission time should not be empty");
                }
                break;
            }
            case configMustKeys.testType: {
                if (typeof value !== "string") {
                    errors.push("test type should be string");
                } else {
                    if (value.length === 0) errors.push("test type should not be empty");
                }
                break;
            }
            case configMustKeys.totalMarks: {
                if (typeof value !== "string") {
                    errors.push("total marks should be string");
                } else {
                    if (value.length === 0) errors.push("total marks should not be empty");
                }
                break;
            }
            case configMustKeys.examType: {
                if (typeof value !== "string") {
                    errors.push("exam type should be string");
                } else {
                    if (value.length === 0) errors.push("exam type should not be empty");
                }
                break;
            }
            case configMustKeys.startTime: {
                if (typeof value !== "string") {
                    errors.push("start time should be string");
                } else {
                    if (value.length === 0) errors.push("start tiem should not be empty");
                }
                break;
            }
            case configMustKeys.endTime: {
                if (typeof value !== "string") {
                    errors.push("end time should be string");
                } else {
                    if (value.length === 0) errors.push("end time should not be empty");
                }
                break;
            }
            case configMustKeys.duration: {
                if (typeof value !== "string") {
                    errors.push("duration should be string");
                } else {
                    if (value.length === 0) errors.push("duratoin should not be empty");
                }
                break;
            }
            case configMustKeys.datetime: {
                if (typeof value !== "string") errors.push("datetime should be string");
                break;
            }
        }
    }
    return errors;
};

export function validatePaperForm(payload) {
    const errors = [];
    const keys = Object.keys(payload);
    const mustkeys = {
        board: "board",
        klass: "class",
        classId: "class_id",
        config: "config",
        section: "section",
        subjectList: "subjectList",
        topicList: "topicList",
        studentId: "studentId",
        teacherId: "teacherId",
    };

    //check if every key exists
    if (!keys.every((ele) => Object.values(mustkeys).includes(ele))) {
        errors.push("must include all the important keys");
        return errors;
    }

    for (const [key, value] of Object.entries(payload)) {
        switch (key) {
            case mustkeys.board: {
                if (typeof value !== "string") {
                    errors.push("board must be a string");
                } else {
                    if (value.length === 0) errors.push("board should not be empty");
                }
                break;
            }
            case mustkeys.klass: {
                if (typeof value !== "string") {
                    errors.push("class must be a string");
                } else {
                    if (value.length === 0) errors.push("class should not be empty");
                }
                break;
            }
            case mustkeys.classId: {
                if (typeof value !== "string") {
                    errors.push("class_id must be string");
                } else {
                    if (value.length === 0) errors.push("class_id should not be empty");
                }
                break;
            }
            case mustkeys.section: {
                if (typeof value !== "string") {
                    errors.push("section must be string");
                } else {
                    if (value.length === 0) errors.push("secion should not be empty");
                }
                break;
            }
            case mustkeys.subjectList: {
                if (!Array.isArray(value)) {
                    errors.push("subject list must be array");
                } else {
                    if (value.length === 0) errors.push("subject list should not be empty");
                }
                break;
            }
            case mustkeys.topicList: {
                if (!Array.isArray(value)) {
                    errors.push("topic list must be array");
                } else {
                    if (value.length === 0) errors.push("topic list should not be empty");
                }
                break;
            }
            case mustkeys.studentId: {
                if (!Array.isArray(value)) {
                    errors.push("student list must be array");
                }
                break;
            }
            case mustkeys.teacherId: {
                if (typeof value !== "string") {
                    errors.push("teacher must be string");
                } else {
                    if (value.length === 0) errors.push("teacher should not be empty");
                }
                break;
            }
            case mustkeys.config: {
                if (typeof value !== "object") {
                    errors.push("config must be object");
                } else {
                    const err = configObjectValidate(value);
                    err.forEach((el) => errors.push(el));
                }
                break;
            }
        }
    }

    return errors;
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
