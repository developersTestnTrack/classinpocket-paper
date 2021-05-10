import { firestoreDB, firestoreTimeStamp } from "./fire";
import parseISO from "date-fns/parseISO";

export async function addPaper({ school_id, paper }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);

    const { questions, ...restPaper } = paper;
    const paperDocumentRef = await schoolCollection.collection("papers").add({
        ...restPaper,
        start_time: firestoreTimeStamp.fromDate(parseISO(restPaper.start_time)),
        end_time: firestoreTimeStamp.fromDate(parseISO(restPaper.end_time)),
    });

    await Promise.all(questions.map((question) => paperDocumentRef.collection("questions").add(question)));

    return paperDocumentRef.id;
}

export async function addStudents({ school_id, student_list }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);

    await Promise.all(
        student_list.map((student) => {
            const studentDocSnapShotRef = schoolCollection.collection("students").doc();

            return studentDocSnapShotRef.set({
                ...student,
                created_date: firestoreTimeStamp.fromDate(new Date()),
                id: studentDocSnapShotRef.id,
            });
        })
    );
}
