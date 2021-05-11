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
        const pdfUploadTask = await Promise.all([
            paperStorageRef
                .child(`${getTime(new Date())}${question_pdf_blob.name}`, { contentType: "application/pdf" })
                .put(question_pdf_blob),
            paperStorageRef
                .child(`${getTime(new Date())}${solution_pdf_blob.name}`, { contentType: "application/pdf" })
                .put(solution_pdf_blob),
        ]);

        // get bucket url
        const question_pdf_url = await pdfUploadTask[0].ref.getDownloadURL();
        const solution_pdf_url = await pdfUploadTask[1].ref.getDownloadURL();

        // upload paper to database with pdf url
        await paperDocRef.set({
            ...paper,
            id: paperDocRef.id,
            start_time: firestoreTimeStamp.fromDate(parseISO(paper.start_time)),
            end_time: firestoreTimeStamp.fromDate(parseISO(paper.end_time)),
            pdf: { ...paper.pdf, pdf_paper: question_pdf_url, solution_pdf: solution_pdf_url },
        });

        return paperDocRef.id;
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
    const studentsIds = [];

    await Promise.all(
        student_list.map((student) => {
            const studentDocSnapShotRef = schoolCollection.collection("students").doc();
            studentsIds.push(studentDocSnapShotRef.id);

            return studentDocSnapShotRef.set({
                ...student,
                created_date: firestoreTimeStamp.fromDate(new Date()),
                id: studentDocSnapShotRef.id,
            });
        })
    );

    return studentsIds;
}
