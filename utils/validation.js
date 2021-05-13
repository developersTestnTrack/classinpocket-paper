import Validator from "validatorjs";
import validate from "validate.js";

export function validatePaperDetails(paperDetails) {
    const rules = {
        "config.name": {
            presence: { allowEmpty: false, message: "Paper name is required" },
            type: "string",
        },
        "config.submissionTime": {
            presence: { allowEmpty: false, message: "submission is required" },
            type: "string",
        },
        "config.questionType": {
            presence: { allowEmpty: false, message: "Question type is required" },
            type: "string",
        },
        "config.paperType": {
            presence: { allowEmpty: false, message: "Paper type is required" },
            type: "string",
        },
        "config.paperRejoin": {
            presence: { allowEmpty: false, message: "Paper rejoin is required" },
            type: "string",
        },
        "config.examType": {
            presence: { allowEmpty: false, message: "Exam type is required" },
            type: "string",
        },
        "config.totalMarks": {
            presence: { allowEmpty: false, message: "Total marks is required" },
            type: "string",
        },
        "config.testType": {
            presence: { allowEmpty: false, message: "Test type is required" },
            type: "string",
        },
        board: {
            presence: { allowEmpty: false, message: "board name is required" },
            type: "string",
        },
        class: {
            presence: { allowEmpty: false, message: "class name is required" },
            type: "string",
        },
        class_id: {
            presence: { allowEmpty: false, message: "class id is required" },
            type: "string",
        },
        section: { presence: { allowEmpty: false, message: "section name is required" }, type: "string" },
        teacherId: { presence: { allowEmpty: false, message: "one teacher is required" }, type: "string" },
        subjectList: {
            presence: { allowEmpty: false, message: "subject field is required" },
            type: "array",
            length: {
                minimum: 1,
                message: "select atleast one subject",
            },
        },
        topicList: {
            presence: { allowEmpty: false, message: "topic field is required" },
            type: "array",
            length: {
                minimum: 1,
                message: "select atleast one topic",
            },
        },
    };

    const result = validate(paperDetails, rules, { format: "flat" });

    if (result && result.length > 0) {
        return { hasError: true, msgs: result };
    } else {
        return { hasError: false, msgs: [] };
    }
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
