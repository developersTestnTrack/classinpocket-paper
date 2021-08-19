import Grid from "@material-ui/core/Grid";

import { Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { EditorGlobal } from "@/components/exam-paper-generate/editor/editorUtil";
import MainEditor from "@/components/exam-paper-generate/editor/MainEditor";
import QuestionDetailPanel from "@/components/exam-paper-generate/editor/QuestionDetailPanel";
import PreviewList from "@/components/exam-paper-generate/editor/PreviewList";

const EditorContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2, 0, 4, 0),
}));

export default function QuestionEditor({ paperDetails }) {
    const initialState = {
        question: {
            text: "",
            config: {
                time: "",
                marks: "",
                cat: paperDetails.config.paperType === "Examania" ? "Subjective" : "MCQ",
                type: paperDetails.config.paperType === "Examania" ? "None" : "Multiple",
                pdf: "link",
                video: "",
                subjectId: "",
                courseId: "",
            },
            options: [
                { rank: 1, status: false, text: "" },
                { rank: 2, status: false, text: "" },
                { rank: 3, status: false, text: "" },
                { rank: 4, status: false, text: "" },
            ],
        },
        edit: {
            isEditing: false,
            index: 0,
        },
        list: [],
        paper: paperDetails,
    };

    return (
        <Container maxWidth="xl">
            <EditorGlobal initialState={initialState}>
                <EditorContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <QuestionDetailPanel />
                        </Grid>
                        <Grid item xs={8}>
                            <MainEditor
                                nextInitialState={{
                                    question: initialState.question,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <PreviewList />
                        </Grid>
                    </Grid>
                </EditorContainer>
            </EditorGlobal>
        </Container>
    );
}
