import { firestoreDB, firestoreTimeStamp } from "./fire";
import parseISO from "date-fns/parseISO";

export async function addPaper({ school_id, paper }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);

    const { questions, ...restPaper } = paper;
    const timestamp = firestoreTimeStamp.fromDate(parseISO(restPaper.start_time));
    console.log(timestamp);

    const paperDocumentRef = await schoolCollection.collection("papers").add({
        ...restPaper,
        start_time: firestoreTimeStamp.fromDate(parseISO(restPaper.start_time)),
        end_time: firestoreTimeStamp.fromDate(parseISO(restPaper.end_time)),
    });

    await Promise.all(questions.map((question) => paperDocumentRef.collection("questions").add(question)));

    return paperDocumentRef.id;
}
