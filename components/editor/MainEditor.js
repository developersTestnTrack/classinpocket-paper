import { useState, useRef } from "react";
// import { Scrollbars } from "react-custom-scrollbars";

import { Grid, Typography, Button, Switch } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";

import Snack from "../Snack";
import { editorHW, useEditor } from "./editorUtil";
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

const PaperHeader = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
}));

const OptionHeader = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
}));

function RenderOptions() {
    const [state, dispatch] = useEditor();

    const {
        question: { options },
    } = state;

    return options.map((option, i) => (
        <Grid item md={12} lg={12} key={i}>
            <OptionHeader>
                <Typography variant="h5">Option: {option.rank}</Typography>
                <Switch
                    color="primary"
                    checked={option.status}
                    onChange={() => {
                        dispatch({
                            type: "UPDATE_OPTION",
                            option: { rank: option.rank, status: !option.status },
                        });
                    }}
                />
            </OptionHeader>
            <Editor
                placeholder="Enter your option here"
                setContents={option.text}
                setOptions={{
                    minHeight: editorHW.main.minHeight,
                }}
                onChange={(content) => {
                    dispatch({
                        type: "UPDATE_OPTION",
                        option: { rank: option.rank, text: content },
                    });
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
    ));
}

export default function MainEditor({ nextInitialState }) {
    const ref = useRef();
    const [state, dispatch] = useEditor();
    const [snackState, setSnackState] = useState({ open: false, status: "error", msg: "Please fill all the fields" });
    const classes = useStyles();

    console.log(state);

    const { question, list, edit, paper } = state;

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
        <>
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
            <Grid container spacing={1} style={{ maxHeight: "90vh", overflowY: "scroll" }}>
                <Grid item xs={12}>
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
            </Grid>
            <Snack
                open={snackState.open}
                onClose={() => setSnackState((prevState) => ({ ...prevState, open: false }))}
                msg={snackState.msg}
                status={snackState.status}
            />
        </>
    );
}
