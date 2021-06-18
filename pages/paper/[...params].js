import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";

import Page from "@/components/Page";
import { Progress } from "@/components/Common";

import { getClassById } from "@/utils/api/firebase-api/query";

const QuestionEditor = dynamic(() => import("@/components/editor/QuestionEditor"));
const PdfUpload = dynamic(() => import("@/components/PdfUpload"));
const PaperDetail = dynamic(() => import("@/components/PaperDetail"));

function PaperPage({ params }) {
    const [editor, setEditor] = useState({ show: false, data: {} });
    const { data, isLoading } = useQuery("classes", () => getClassById({ school_id: params[0], class_id: params[1] }), {
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <Progress />;
    }

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
                <PaperDetail
                    details={data}
                    onFinish={(data) => {
                        console.log(data);
                        setEditor((prevState) => ({ show: !prevState.show, data }));
                    }}
                />
            </Page>
        );
    }
}

export function getServerSideProps({ params }) {
    return {
        props: { params: params.params },
    };
}

export default function Paper({ params }) {
    return <PaperPage params={params} />;
}
