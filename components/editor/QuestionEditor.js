import Grid from "@material-ui/core/Grid";

import { styled } from "@material-ui/core/styles";

import { EditorGlobal } from "./editorUtil";
import MainEditor from "./MainEditor";
import QuestionDetailPanel from "./QuestionDetailPanel";

import PreviewList from "@/components/editor/PreviewList";

const EditorContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2, 0, 4, 0),
}));

export default function QuestionEditor({ paperDetails }) {
    return (
        <EditorGlobal
            initialState={{
                question: {
                    id: String(Date.now()),
                    text: "",
                    config: {
                        time: "",
                        marks: "",
                        cat: paperDetails.config.paperType === "Examania" ? "Subjective" : "MCQ",
                        type: paperDetails.config.paperType === "Examania" ? "None" : "Multiple",
                        pdf: "",
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
            }}
        >
            <EditorContainer>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <QuestionDetailPanel />
                    </Grid>
                    <Grid item xs={8}>
                        <MainEditor
                            nextInitialState={{
                                question: {
                                    id: String(Date.now()),
                                    text: "",
                                    config: {
                                        time: "",
                                        marks: "",
                                        cat: paperDetails.config.paperType === "Examania" ? "Subjective" : "MCQ",
                                        type: paperDetails.config.paperType === "Examania" ? "None" : "Multiple",
                                        pdf: "",
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
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <PreviewList />
                    </Grid>
                </Grid>
            </EditorContainer>
        </EditorGlobal>
    );
}
