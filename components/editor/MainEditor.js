import { useState } from "react";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";

import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Snack from "../Snack";
import RenderOptions from "./RenderOptions";
import { PaperHeader, buttonList, useEditor, editorHW } from "./editorUtil";
import { validateQuestion } from "@/utils/validation";

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
    const [state, dispatch] = useEditor();
    const [snackState, setSnackState] = useState({ open: false, status: "error", msg: "Please fill all the fields" });

    const classes = useStyles();

    const { question, list, edit, paper } = state;

    const onClickAddBtn = () => {
        const { pass, errors } = validateQuestion(question, paper.config.paperType);

        if (pass) {
            dispatch({
                type: "ADD_QUESTION",
                nextInitialState: nextInitialState.question,
            });
        } else {
            console.log(errors);
            setSnackState((prevState) => ({ ...prevState, open: true }));
        }
    };

    return (
        <Grid container spacing={1}>
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
                                variant="outlined"
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
                                variant="outlined"
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
                        <Button variant="outlined" color="primary" onClick={onClickAddBtn}>
                            Add
                        </Button>
                    )}
                </PaperHeader>
                <SunEditor
                    placeholder="Enter your question here"
                    setContents={question.text}
                    onChange={(content) => {
                        dispatch({ type: "UPDATE_QUESTION_TEXT", text: content });
                    }}
                    setOptions={{
                        minHeight: question.config.cat !== "MCQ" ? 600 : editorHW.main.minHeight,
                        katex: katex,
                        buttonList,
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
