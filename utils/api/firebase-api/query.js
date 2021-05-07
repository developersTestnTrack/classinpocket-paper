import { firestoreDB, firestoreTimeStamp } from "./fire";

export async function getClassById({ school_id, class_id }) {
    const schoolCollection = firestoreDB.collection("schools").doc(school_id);
    const timestamp = firestoreTimeStamp.fromDate(new Date());
    console.log(timestamp);
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
