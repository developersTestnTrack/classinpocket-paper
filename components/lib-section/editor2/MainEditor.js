import dynamic from "next/dynamic";
import { useState, useRef } from "react";

import { Grid, Typography, Button, Switch, Container } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import Snack from "../../Snack";
import { Progress } from "../../Common";
import { editorHW, useEditor } from "./editorUtil";

const Editor = dynamic(() => import("./Editor"), {
    ssr: false,
    loading: function loader() {
        return <Progress>loading</Progress>;
    },
});

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
    const { question } = state;

    return question.options.map((option, i) => (
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

    const { question, list, edit } = state;

    const onClickAddBtn = () => {
        dispatch({
            type: "ADD_QUESTION",
            nextInitialState: nextInitialState.question,
        });
    };

    return (
        <Container>
            <PaperHeader>
                <Typography variant="h5">{edit.isEditing ? "Edit" : `Question: ${list.length + 1}`}</Typography>
                {edit.isEditing ? (
                    <div>
                        <Button
                            size="small"
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
                            size="small"
                            style={{ marginLeft: "10px" }}
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
                    <div>
                        <Button size="small" variant="contained" color="primary" onClick={onClickAddBtn}>
                            Next Question
                        </Button>
                        <Button
                            size="small"
                            style={{ marginLeft: "10px" }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                ref.current.setContents("");
                            }}
                        >
                            clear
                        </Button>
                    </div>
                )}
            </PaperHeader>
            <Grid container spacing={1} style={{ overflowY: "auto", maxHeight: "80vh" }}>
                <Grid item xs={12}>
                    <Editor
                        getSunEditorInstance={(refEditor) => {
                            ref.current = refEditor;
                        }}
                        placeholder="Enter your question here"
                        setOptions={{
                            minHeight: 300,
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
                {state.paper.hasOption && <RenderOptions />}
            </Grid>
            <Snack
                open={snackState.open}
                onClose={() => setSnackState((prevState) => ({ ...prevState, open: false }))}
                msg={snackState.msg}
                status={snackState.status}
            />
        </Container>
    );
}
