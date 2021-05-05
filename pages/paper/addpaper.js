import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { firestoreDB } from "@/utils/api/firebase-api/fire";

import Page from "@/components/Page";
import StepForm from "@/components/step-form/StepForm";

const QuestionEditor = dynamic(() => import("@/components/editor/QuestionEditor"));
const PdfUpload = dynamic(() => import("@/components/PdfUpload"));

export default function Paper() {
    const [editor, setEditor] = useState({ show: false, data: {} });

    useEffect(() => {
        firestoreDB
            .collection("service")
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    console.log(doc.data());
                });
            });
    });

    if (editor.show && editor.data?.config.questionType === "Individual") {
        return (
            <Page showSideBar={false}>
                <QuestionEditor paperDetails={editor.data} />
            </Page>
        );
    } else if (editor.show && editor.data?.config.questionType === "Pdf") {
        return (
            <Page showSideBar={false}>
                <PdfUpload paperDetails={editor.data} />
            </Page>
        );
    } else {
        return (
            <Page showSideBar={false}>
                <StepForm
                    onFinish={(data) => {
                        console.log(data);
                        setEditor((prevState) => ({ show: !prevState.show, data }));
                    }}
                />
            </Page>
        );
    }
}
