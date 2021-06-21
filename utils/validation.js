import Validator from "validatorjs";

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

export function validateQuestion(question, type) {
    let rules;

    if (type === "Examania") {
        rules = {
            text: "required|string",
            "config.time": "required|string",
            "config.marks": "required|string",
            "config.cat": "required|string",
            "config.type": "required|string",
            "config.pdf": "required|string",
            "config.video": "required|string",
            "config.subjectId": "required|string",
            "config.courseId": "required|string",
        };
    } else {
        rules = {
            text: "required|string",
            "config.time": "required|string",
            "config.marks": "required|string",
            "config.cat": "required|string",
            "config.type": "required|string",
            "config.pdf": "required|string",
            "config.video": "required|string",
            "config.subjectId": "required|string",
            "config.courseId": "required|string",
            "options.*.rank": "required|numeric",
            "options.*.status": "required|boolean",
            "options.*.text": "required|string",
        };
    }

    const validate = new Validator(question, rules);

    return {
        pass: validate.passes(),
        errors: validate.errors.all(),
    };
}
