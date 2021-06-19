import { useQuery } from "react-query";

import Page from "@/components/Page";
import { Progress } from "@/components/Common";
import PaperDetail from "@/components/PaperDetail";

import { getClassById } from "@/utils/api/firebase-api/query";

function PaperPage({ params }) {
    const { data, isLoading } = useQuery("classes", () => getClassById({ school_id: params[0], class_id: params[1] }), {
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <Progress />;
    }

    return (
        <Page showSideBar={false}>
            <PaperDetail details={data} />
        </Page>
    );
}

export function getServerSideProps({ params }) {
    return {
        props: { params: params.params },
    };
}

export default function Paper({ params }) {
    return <PaperPage params={params} />;
}
