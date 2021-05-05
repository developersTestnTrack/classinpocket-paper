import Validator from "validatorjs";

export function validatePackage(pack) {
    const rules = {
        boardId: "required|string",
        classId: "required|string",
        packageName: "required|string",
        packageRate: "required|numeric",
        packageDescription: "required|string",
        packageStatus: "required|string",
        packageImage: "present",
        packageEndDate: "required",
        paperList: "array",
    };

    const validate = new Validator(pack, rules);

    return {
        pass: validate.passes(),
        errors: validate.errors.all(),
    };
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
