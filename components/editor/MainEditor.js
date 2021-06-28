import { useState, useRef, useEffect } from "react";

import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Snack from "../Snack";
import RenderOptions from "./RenderOptions";
import { editorHW, PaperHeader, useEditor } from "./editorUtil";
import { validateQuestion } from "@/utils/validation";
import Editor from "./Editor";

const useStyles = makeStyles((theme) => ({
    btns: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
    },
    btn: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

export default function MainEditor({ nextInitialState }) {
    const ref = useRef();
    const [state, dispatch] = useEditor();
    const [snackState, setSnackState] = useState({ open: false, status: "error", msg: "Please fill all the fields" });
    const classes = useStyles();

    const { question, list, edit, paper } = state;

    useEffect(() => {
        console.log(state);
    });

    const onClickAddBtn = () => {
        const errors = validateQuestion(question, paper, list);

        if (errors.length === 0) {
            dispatch({
                type: "ADD_QUESTION",
                nextInitialState: nextInitialState.question,
            });
        } else {
            console.log(errors);
            setSnackState(() => ({ open: true, status: "error", msg: errors[0] }));
        }
    };

    return (
        <Grid container style={{ height: "95vh", overflowY: "scroll" }} spacing={1}>
            <Grid item xs={12}>
                <PaperHeader>
                    {edit.isEditing ? (
                        <Typography variant="h4">Edit</Typography>
                    ) : (
                        <Typography variant="h4">Question: {list.length + 1}</Typography>
                    )}

                    {edit.isEditing ? (
                        <div className={classes.btns}>
                            <Button
                                className={classes.btn}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    dispatch({
                                        type: "SAVE_EDIT",
                                        question: question,
                                        initialState: { ...nextInitialState.question },
                                    });
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                className={classes.btn}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    dispatch({
                                        type: "DISABLE_EDIT",
                                        initialState: { ...nextInitialState.question },
                                    });
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    ) : (
                        <Button variant="contained" color="primary" onClick={onClickAddBtn}>
                            Next Question
                        </Button>
                    )}
                </PaperHeader>
                <Editor
                    getSunEditorInstance={(refEditor) => {
                        ref.current = refEditor;
                    }}
                    placeholder="Enter your question here"
                    setOptions={{
                        minHeight: question.config.cat !== "MCQ" ? 600 : editorHW.main.minHeight,
                    }}
                    setContents={question.text}
                    onChange={(content) => {
                        console.log(content);
                        dispatch({ type: "UPDATE_QUESTION_TEXT", text: content });
                    }}
                    onImageUploadBefore={(files, _info, uploadHandler) => {
                        const file = files[0];

                        if (file.size / 1024 > 50) {
                            window.alert("image size too big, image should be less then 50kb");
                            uploadHandler();
                        } else {
                            uploadHandler(files);
                        }
                    }}
                />
            </Grid>
            {question.config.cat === "MCQ" && <RenderOptions />}
            <Snack
                open={snackState.open}
                onClose={() => setSnackState((prevState) => ({ ...prevState, open: false }))}
                msg={snackState.msg}
                status={snackState.status}
            />
        </Grid>
    );
}
