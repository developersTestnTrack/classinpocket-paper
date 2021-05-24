import { firestoreDB } from "./fire";

export async function getClassById({ school_id, class_id }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);
    try {
        const doc = await schoolCollection.collection("classes").doc(class_id).get();

        const studentListQuerySnapShot = await schoolCollection
            .collection("students")
            .where("class_id", "==", class_id)
            .get();
        const teacherListQuerySnapShot = await schoolCollection
            .collection("teachers")
            .where("class_id_list", "array-contains", class_id)
            .get();

        const student_list = studentListQuerySnapShot.docs.map((doc) => doc.data());
        const teacher_list = teacherListQuerySnapShot.docs.map((doc) => doc.data());

        return { ...doc.data(), student_list, teacher_list };
    } catch {
        throw new Error("Error in fetching classes.");
    }
}

export async function getPaper({ schoolId, paperId }) {
    const schoolCollection = firestoreDB.collection("schools").doc(schoolId);
    const paper = await schoolCollection.collection("papers").doc(paperId).get();
    const questions = await schoolCollection.collection("papers").doc(paperId).collection("questions").get();

    const questionsList = [];

    questions.forEach((doc) => {
        questionsList.push({ questionNumber: doc.get("question_no"), id: doc.id });
    });

    return {
        paper: paper.data(),
        questions: questionsList.sort((a, b) => a.questionNumber - b.questionNumber),
        totalQuestions: questions.size,
    };
}

export async function getQuestion({ schoolId, paperId, questionId }) {
    const schoolCollection = firestoreDB.collection("schools").doc(schoolId);
    const question = await schoolCollection
        .collection("papers")
        .doc(paperId)
        .collection("questions")
        .doc(questionId)
        .get();

    return question.data();
}
