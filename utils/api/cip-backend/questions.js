import fetch from "isomorphic-unfetch";

const uri = "https://us-central1-classinpocket-f5907.cloudfunctions.net/httpstrigger-backend/api";
// const uri = "http://localhost:5001/classinpocket-f5907/us-central1/httpstrigger-backend/api";

export class CustomError extends Error {
    constructor(name, message, json) {
        super(message);
        this.name = name;
        this.json = json;
    }
}

/**
 * @param {Object} body requset body for question api
 * @param {number} body.number_of_questions total number of questions
 * @param {Record<string, any>} body.list list of questions
 * @returns {Promise<string>} return successfully message from api
 */
export async function submitQuestions(body) {
    const response = await fetch(`${uri}/question/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        return await response.json();
    } else {
        const res = await response.json();
        console.log(res);
        throw new CustomError("ERR_REQUEST_FAILED", "Error in submitting questions", await response.json());
    }
}

export async function getAllQuestions() {
    const response = await fetch(`${uri}/question/`);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(response);
    }
}

/**
 * @param {Object} body getFilterQuestions body
 * @param {string} body.board board name
 * @param {string} body.class class name
 * @param {string} body.subject subject name
 */
export async function getFilteredQuestions(body) {
    const response = await fetch(`${uri}/question/get/filter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ board: body.board, class_name: body.class, subject: body.subject }),
    });

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        throw new Error(response);
    }
}

/**
 * @param {Object} body getFixedQuestions body
 * @param {string} body.board board name
 * @param {string} body.class class name
 * @param {string} body.subject subject name
 * @param {string} body.questions_number number of questions to get
 */
export async function getFixedQuestions(body) {
    const response = await fetch(`${uri}/question/paper`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            board: body.board,
            class_name: body.class,
            subject: body.subject,
            number_of_questions: Number(body.questions_number),
        }),
    });

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        throw new Error(response);
    }
}

/**
 * @param {Object} body getFixedQuestions body
 * @param {string} body.board board name
 * @param {string} body.class_name class name
 * @param {string} body.subject subject name
 * @param {string[]} body.chapter chapter names
 * @param {string} body.total_marks number of questions to get
 */
export async function getFixedFormatQuestions(body) {
    const response = await fetch(`${uri}/question/paper/format`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            total_marks: body.total_marks,
        }),
    });

    if (response.ok) {
        const result = await response.json();
        const list = Object.values(result.data).flat();
        return list;
    } else {
        const errorBody = await response.json();
        console.log(errorBody);
        throw new Error(response);
    }
}

/**
 * @param {Object} body getFreshQuestion body
 * @param {string} body.board board name
 * @param {string} body.class class name
 * @param {string} body.subject subject name
 * @param {string[]} body.chapter chapter list
 * @param {number} body.questions_marks number of questions to get
 * @param {string[]} body.question_ids question ids
 */
export async function getFreshQuestion(body) {
    console.log(body);
    const response = await fetch(`${uri}/question/paper/refetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            board: body.board,
            class_name: body.class,
            subject: body.subject,
            chapter: body.chapter,
            number_of_questions: 1,
            question_ids: body.question_ids,
            question_marks: body.question_marks,
        }),
    });

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        const res = await response.json();
        console.log(res);
        throw new Error(response);
    }
}

/**
 * @param {string[]} body fetchQuestionsByIds body
 */
export async function fetchQuestionsByIds(body) {
    const url = new URL(`${uri}/question/questions`);
    const params = new URLSearchParams({ ids: body });

    const response = await fetch(`${url.href}/?${params.toString()}`);

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        throw new Error(response);
    }
}
