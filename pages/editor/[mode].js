import { useEffect, useReducer, useState } from "react";
import { Container, Grid, TextField, MenuItem, Button, Dialog } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";

import QuestionEditor from "@/components/editor2/QuestionEditor";
import { firestoreDB } from "@/utils/api/firebase-api/fire";

export async function getServerSideProps({ params }) {
    const docRef = await firestoreDB.collection("classinpocket").doc(params.mode).get();
    console.log(docRef.data());
    return {
        props: { mode: params.mode, payload: JSON.parse(JSON.stringify(docRef.data())) },
    };
}

/**
 * @param {Object} editor - The payload for editor.
 * @param {string} editor.mode - editor mode.
 * @param {Object} editor.payload - editor payload object.
 * @param {string} editor.payload.type - mode type
 * @param {string[]} editor.payload.board_list - board list
 * @param {string[]} editor.payload.class_list - class list
 * @param {string[]} editor.payload.subject_list - subject list
 * @param {string[]} editor.payload.paper_cat_list - paper catagory list
 */
export default function Editor({ mode, payload }) {
    const [openDialog, setDialog] = useState(false);

    const [formState, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "BOARD": {
                    return { ...state, board: action.value };
                }
                case "KLASS": {
                    return { ...state, klass: action.value };
                }
                case "SUBJECT": {
                    return { ...state, subject: action.value };
                }
                case "PAPER_CAT": {
                    return { ...state, paper_cat: action.value };
                }
                case "CHAPTER": {
                    return { ...state, chapter: action.value };
                }
                case "TOPIC": {
                    return { ...state, topic: action.value };
                }
                case "MARKS": {
                    return { ...state, marks: action.value };
                }
                case "QUESTION_CAT": {
                    return { ...state, question_cat: action.value };
                }
            }
        },
        {
            board: "",
            klass: "",
            subject: "",
            paper_cat: "",
            chapter: "",
            topic: [],
            marks: "",
            question_cat: "",
        }
    );

    useEffect(() => {
        console.log(mode);
        console.log(payload);
        console.log(formState);
    });

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const PaperProps = {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    };

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} />
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Board"
                        select
                        SelectProps={{
                            MenuProps: {
                                PaperProps: PaperProps,
                            },
                        }}
                        value={formState.board}
                        onChange={(e) => {
                            dispatch({ type: "BOARD", value: e.target.value });
                        }}
                    >
                        {payload.board_list.map((board) => (
                            <MenuItem key={board} value={board}>
                                {board}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Class"
                        select
                        SelectProps={{
                            MenuProps: {
                                PaperProps: PaperProps,
                            },
                        }}
                        value={formState.klass}
                        onChange={(e) => {
                            dispatch({ type: "KLASS", value: e.target.value });
                        }}
                    >
                        {payload.class_list.map((klass) => (
                            <MenuItem key={klass} value={klass}>
                                {klass}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Subject"
                        select
                        SelectProps={{
                            MenuProps: {
                                PaperProps: PaperProps,
                            },
                        }}
                        value={formState.subject}
                        onChange={(e) => {
                            dispatch({ type: "SUBJECT", value: e.target.value });
                        }}
                    >
                        {payload.subject_list.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                                {subject}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Paper Category"
                        select
                        value={formState.paper_cat}
                        onChange={(e) => {
                            dispatch({ type: "PAPER_CAT", value: e.target.value });
                        }}
                    >
                        {payload.paper_cat_list.map((paperCat) => (
                            <MenuItem key={paperCat} value={paperCat}>
                                {paperCat}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Question Category"
                        select
                        value={formState.question_cat}
                        onChange={(e) => {
                            dispatch({ type: "QUESTION_CAT", value: e.target.value });
                        }}
                    >
                        {payload.questions_cat_list.map((questionCat) => (
                            <MenuItem key={questionCat} value={questionCat}>
                                {questionCat}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Marks"
                        placeholder="Select Marks"
                        select
                        value={formState.marks}
                        onChange={(e) => {
                            dispatch({ type: "MARKS", value: e.target.value });
                        }}
                    >
                        {["1", "2", "3", "4", "5"].map((num) => (
                            <MenuItem key={num} value={num}>
                                {num}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Chapter"
                        placeholder="Enter Chapters"
                        value={formState.chapter}
                        onChange={(e) => {
                            dispatch({ type: "CHAPTER", value: e.target.value });
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ChipInput
                        fullWidth
                        variant="outlined"
                        label="Topic"
                        placeholder="Enter Topics"
                        defaultValue={formState.topic}
                        onChange={(value) => {
                            dispatch({ type: "TOPIC", value });
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setDialog(true);
                        }}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
            <Dialog keepMounted={false} fullScreen open={openDialog} onClose={() => setDialog(false)}>
                <QuestionEditor details={formState} />
            </Dialog>
        </Container>
    );
}
