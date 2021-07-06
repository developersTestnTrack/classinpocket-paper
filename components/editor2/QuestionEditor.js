import Grid from "@material-ui/core/Grid";

import { Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { EditorGlobal } from "@/components/editor2/editorUtil";
import MainEditor from "@/components/editor2/MainEditor";
import QuestionDetailPanel from "@/components/editor2/QuestionDetailPanel";
import PreviewList from "@/components/editor2/PreviewList";

const EditorContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2, 0, 4, 0),
}));

/**
 * @param {Object} editor - The payload for editor.
 * @param {Object} editor.details - details parameter
 * @param {string} editor.details.board - board name
 * @param {string} editor.details.klass - klass name
 * @param {string} editor.details.marks - question marks
 * @param {string} editor.details.paper_cat - paper category list
 * @param {string} editor.details.question_cat - paper question category list
 * @param {string} editor.details.subject - subject name
 * @param {string} editor.details.chapter chapter name
 * @param {string[]} editor.details.topic - topic list
 */
export default function QuestionEditor({ details }) {
    const initialState = {
        question: {
            text: "",
            config: {
                board: details.board,
                klass: details.klass,
                subject: details.subject,
                paper_cat: details.paper_cat,
                question_cat: details.question_cat,
                marks: details.marks,
                topic: [],
                time: "",
                pdf: "link",
                video: "",
                difficulty_level: "",
                chapter: details.chapter,
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
        paper: details,
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
