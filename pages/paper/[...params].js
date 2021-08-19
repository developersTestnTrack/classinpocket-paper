import { useQuery } from "react-query";

import { Progress } from "@/components/Common";
import PaperDetail from "@/components/exam-paper-generate/PaperDetail";

import { getClassById } from "@/utils/api/firebase-api/query";
import { Container, Typography } from "@material-ui/core";

export function getServerSideProps({ params }) {
    return {
        props: { params: params.params },
    };
}

export default function PaperPage({ params }) {
    const { data, isLoading } = useQuery("classes", () => getClassById({ school_id: params[0], class_id: params[1] }), {
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <Progress />;
    }

    if (data.teacher_list.length === 0 || data.student_list.length === 0) {
        return (
            <Container
                maxWidth="xl"
                style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Typography component="p" variant="h4">
                    No teacher or student available
                </Typography>
            </Container>
        );
    }

    return <PaperDetail details={data} />;
}
