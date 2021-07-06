import fetch from "isomorphic-unfetch";

const uri = "http://localhost:3000/api/question/add";

/**
 *
 * @param {Object} body requset body for question api
 * @param {number} body.number_of_questions total number of questions
 * @param {Record<string, any>} body.list list of questions
 * @returns {Promise<string>} return successfully message from api
 */
export async function submitQuestions(body) {
    const response = await fetch(uri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const result = await response.text();

    return result;
}
