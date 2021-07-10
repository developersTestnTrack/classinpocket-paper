import fetch from "isomorphic-unfetch";

const uri = "http://localhost:5001/classinpocket-f5907/us-central1/httpstrigger-backend/api";

/**
 *
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
        return await response.text();
    } else {
        throw new Error(response);
    }
}
