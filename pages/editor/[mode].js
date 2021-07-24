import { useReducer, useState } from "react";
import { Container, Grid, TextField, MenuItem, Button, Dialog, FormControlLabel, Switch } from "@material-ui/core";

import QuestionEditor from "@/components/editor2/QuestionEditor";
import Snack from "@/components/Snack";
import { firestoreDB } from "@/utils/api/firebase-api/fire";
import { validateLibEditorFormData } from "@/utils/validation";

export async function getServerSideProps({ params }) {
    const docRef = await firestoreDB.collection("classinpocket").doc(params.mode).get();
    const lib = await firestoreDB.collection("library").doc("Library topics").get();

    return {
        props: {
            mode: params.mode,
            payload: JSON.parse(JSON.stringify(docRef.data())),
            lib: JSON.parse(JSON.stringify(lib.data())),
        },
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
 * @param {Object} editor.lib - lib data
 */
export default function Editor({ lib }) {
    const [openDialog, setDialog] = useState(false);
    const [snack, setSnackState] = useState({ open: false, msg: "", status: "idle" });

    console.log(lib);

    const [formState, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "BOARD": {
                    return { ...state, board: action.value, klass: "", subject: "", chapter: "", topic: [] };
                }
                case "KLASS": {
                    return { ...state, klass: action.value, subject: "", chapter: "", topic: [] };
                }
                case "SUBJECT": {
                    return { ...state, subject: action.value, chapter: "", topic: [] };
                }
                case "CHAPTER": {
                    return { ...state, chapter: action.value, topic: [] };
                }
                case "TOPIC": {
                    return { ...state, topic: action.value };
                }
                case "PAPER_CAT": {
                    return { ...state, paper_cat: action.value };
                }
                case "MARKS": {
                    return { ...state, marks: action.value };
                }
                case "QUESTION_CAT": {
                    return { ...state, question_cat: action.value };
                }
                case "OPTIONS": {
                    return { ...state, hasOption: action.value };
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
            hasOption: false,
        }
    );

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const PaperProps = {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    };

    console.log(formState);

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
                        {lib.board_list
                            .map((obj) => obj.board)
                            .sort((a, b) => {
                                var nameA = a.toUpperCase(); // ignore upper and lowercase
                                var nameB = b.toUpperCase(); // ignore upper and lowercase
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }

                                // names must be equal
                                return 0;
                            })
                            .map((board) => (
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
                        {formState.board.length > 0 ? (
                            lib.class_list
                                .filter((obj) => obj.board === formState.board)
                                .map((obj) => obj.class)
                                .map((klass) => (
                                    <MenuItem key={klass} value={klass}>
                                        {klass}
                                    </MenuItem>
                                ))
                        ) : (
                            <MenuItem value="no value">No board selected</MenuItem>
                        )}
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
                        {formState.klass.length > 0 ? (
                            lib.subject_list
                                .filter((obj) => obj.board === formState.board && obj.class === formState.klass)
                                .map((obj) => obj.subject)
                                .map((subject) => (
                                    <MenuItem key={subject} value={subject}>
                                        {subject}
                                    </MenuItem>
                                ))
                        ) : (
                            <MenuItem value="no value">No class selected</MenuItem>
                        )}
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
                        {lib.paper_cat_list.map((paperCat) => (
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
                        {lib.questions_cat_list.map((questionCat) => (
                            <MenuItem key={questionCat} value={questionCat}>
                                {questionCat}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        control={
                            <Switch
                                color="primary"
                                checked={formState.hasOption}
                                onChange={() => dispatch({ type: "OPTIONS", value: !formState.hasOption })}
                                name="options"
                            />
                        }
                        label="Render Options"
                    />
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
                        select
                        fullWidth
                        variant="outlined"
                        label="Chapter"
                        placeholder="Enter Chapters"
                        value={formState.chapter}
                        onChange={(e) => {
                            dispatch({ type: "CHAPTER", value: e.target.value });
                        }}
                    >
                        {formState.subject.length > 0 ? (
                            lib.chapter_list
                                .filter(
                                    (obj) =>
                                        obj.board === formState.board &&
                                        obj.class === formState.klass &&
                                        obj.subject === formState.subject
                                )
                                .map((obj) => obj.chapter)
                                .map((chapter) => (
                                    <MenuItem key={chapter} value={chapter}>
                                        {chapter}
                                    </MenuItem>
                                ))
                        ) : (
                            <MenuItem value="no value">No subject selected</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        SelectProps={{ multiple: true }}
                        fullWidth
                        variant="outlined"
                        label="Topic"
                        placeholder="Enter Topics"
                        value={formState.topic}
                        onChange={(e) => {
                            dispatch({ type: "TOPIC", value: e.target.value });
                        }}
                    >
                        {formState.chapter.length > 0 ? (
                            lib.topic_list
                                .filter(
                                    (obj) =>
                                        obj.board === formState.board &&
                                        obj.class === formState.klass &&
                                        obj.subject === formState.subject &&
                                        obj.chapter === formState.chapter
                                )
                                .map((obj) => obj.topic)
                                .map((topic) => (
                                    <MenuItem key={topic} value={topic}>
                                        {topic}
                                    </MenuItem>
                                ))
                        ) : (
                            <MenuItem value="no value">No chapter selected</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            const valid = validateLibEditorFormData(formState);
                            if (valid) {
                                setDialog(true);
                            } else {
                                setSnackState({ open: true, msg: "Please check all the flields", status: "error" });
                            }
                        }}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
            <Snack
                open={snack.open}
                onClose={() => {
                    setSnackState((prevState) => ({ ...prevState, open: false }));
                }}
                status={snack.status}
                msg={snack.msg}
            />
            <Dialog keepMounted={false} fullScreen open={openDialog} onClose={() => setDialog(false)}>
                <QuestionEditor details={formState} />
            </Dialog>
        </Container>
    );
}
