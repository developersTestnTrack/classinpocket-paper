import { firestoreDB, firestoreTimeStamp, firebaseStorage } from "./fire";
import parseISO from "date-fns/parseISO";
import getTime from "date-fns/getTime";

export async function uploadPdfPaper({ paper, question_pdf_blob, solution_pdf_blob, school_id }) {
    const storageRef = firebaseStorage.ref();
    const paperStorageRef = storageRef.child("papers");
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);
    const paperDocRef = schoolCollection.collection("papers").doc();

    try {
        // upload both pdf to bucket
        let question_pdf_url = "";
        if (question_pdf_blob) {
            const objRef = await paperStorageRef
                .child(`question_pdf_${getTime(new Date())}${question_pdf_blob.name}`.replaceAll(" ", "").toLowerCase())
                .put(question_pdf_blob, {
                    contentType: "application/pdf",
                });

            question_pdf_url = await objRef.ref.getDownloadURL();
        }

        let solution_pdf_url = "";
        if (solution_pdf_blob) {
            const objRef = await paperStorageRef
                .child(`solution_pdf_${getTime(new Date())}${solution_pdf_blob.name}`.replaceAll(" ", "").toLowerCase())
                .put(solution_pdf_blob, {
                    contentType: "application/pdf",
                });
            solution_pdf_url = await objRef.ref.getDownloadURL();
        }

        // upload paper to database with pdf url
        paper.id = paperDocRef.id;
        paper.start_time = firestoreTimeStamp.fromDate(parseISO(paper.start_time));
        paper.end_time = firestoreTimeStamp.fromDate(parseISO(paper.end_time));
        paper.pdf.paper_pdf = question_pdf_url;
        paper.pdf.solution_pdf = solution_pdf_url;

        await paperDocRef.set(paper);

        return paper;
    } catch {
        throw new Error("something went wrong with uploadlPdfPaper function");
    }
}

export async function addPaper({ school_id, paper }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);

    const { questions, ...restPaper } = paper;
    const paperRef = schoolCollection.collection("papers").doc();

    await paperRef.set({
        ...restPaper,
        id: paperRef.id,
        start_time: firestoreTimeStamp.fromDate(parseISO(restPaper.start_time)),
        end_time: firestoreTimeStamp.fromDate(parseISO(restPaper.end_time)),
    });

    await Promise.all(questions.map((question) => paperRef.collection("questions").add(question)));

    return paperRef.id;
}

export async function addStudents({ school_id, student_list }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);
    const batch = firestoreDB.batch();

    student_list.forEach((student) => {
        const studentDocSnapShotRef = schoolCollection.collection("students").doc();
        batch.set(studentDocSnapShotRef, {
            ...student,
            id: studentDocSnapShotRef.id,
            created_date: firestoreTimeStamp.fromDate(new Date()),
        });
    });

    return batch.commit();
}
