import { useReducer, useEffect } from "react";
import { useQuery } from "react-query";
import { Container, Typography, Grid, CssBaseline, TextField, MenuItem, Button } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { getAllQuestions } from "@/utils/api/cip-backend/questions";
import { firestoreDB } from "@/utils/api/firebase-api/fire";

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: "white",
        minHeight: "100vh",
    },
    gridContainer: {
        paddingTop: theme.spacing(2),
    },
}));

export async function getServerSideProps() {
    const docRef = await firestoreDB.collection("classinpocket").doc("SCHOOL").get();
    const lib = await firestoreDB.collection("library").doc("Library topics").get();

    return {
        props: {
            mode: "SCHOOL",
            payload: JSON.parse(JSON.stringify(docRef.data())),
            lib: JSON.parse(JSON.stringify(lib.data())),
        },
    };
}

export default function SearchPage({ lib }) {
    const classes = useStyles();
    const { data: result, isLoading } = useQuery("get all questions", getAllQuestions, { refetchOnWindowFocus: false });

    useEffect(() => {
        console.log("add");
        window.addEventListener(
            "beforeunload",
            (e) => {
                e.preventDefault();
                return (e.returnValue = "prevent");
            },
            { capture: true }
        );
    }, []);

    const [state, dispatch] = useReducer(
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

    if (isLoading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h5" align="center">
                    Loading
                </Typography>
            </Container>
        );
    }
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const PaperProps = {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    };

    console.log(result);
    return (
        <CssBaseline>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={1} className={classes.gridContainer}>
                    <Grid item xs={2}>
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
                            value={state.board}
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
                    <Grid item xs={2}>
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
                            value={state.klass}
                            onChange={(e) => {
                                dispatch({ type: "KLASS", value: e.target.value });
                            }}
                        >
                            {state.board.length > 0 ? (
                                lib.class_list
                                    .filter((obj) => obj.board === state.board)
                                    .map((value) => (
                                        <MenuItem key={value.class} value={value.class}>
                                            {value.class}
                                        </MenuItem>
                                    ))
                            ) : (
                                <MenuItem value="no value">No board selected</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
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
                            value={state.subject}
                            onChange={(e) => {
                                dispatch({ type: "SUBJECT", value: e.target.value });
                            }}
                        >
                            {state.klass.length > 0 ? (
                                lib.subject_list
                                    .filter((obj) => obj.board === state.board && obj.class === state.klass)
                                    .map((value) => (
                                        <MenuItem key={value.subject} value={value.subject}>
                                            {value.subject}
                                        </MenuItem>
                                    ))
                            ) : (
                                <MenuItem value="no value">No class selected</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            select
                            fullWidth
                            variant="outlined"
                            label="Chapter"
                            placeholder="Enter Chapters"
                            value={state.chapter}
                            onChange={(e) => {
                                dispatch({ type: "CHAPTER", value: e.target.value });
                            }}
                        >
                            {state.subject.length > 0 ? (
                                lib.chapter_list
                                    .filter(
                                        (obj) =>
                                            obj.board === state.board &&
                                            obj.class === state.klass &&
                                            obj.subject === state.subject
                                    )
                                    .map((obj) => (
                                        <MenuItem key={obj.chapter} value={obj.chapter}>
                                            {obj.chapter}
                                        </MenuItem>
                                    ))
                            ) : (
                                <MenuItem value="no value">No subject selected</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            select
                            SelectProps={{ multiple: true }}
                            fullWidth
                            variant="outlined"
                            label="Topic"
                            placeholder="Enter Topics"
                            value={state.topic}
                            onChange={(e) => {
                                dispatch({ type: "TOPIC", value: e.target.value });
                            }}
                        >
                            {state.chapter.length > 0 ? (
                                lib.topic_list
                                    .filter(
                                        (obj) =>
                                            obj.board === state.board &&
                                            obj.class === state.klass &&
                                            obj.subject === state.subject &&
                                            obj.chapter === state.chapter
                                    )
                                    .map((obj) => (
                                        <MenuItem key={obj.topic} value={obj.topic}>
                                            {obj.topic}
                                        </MenuItem>
                                    ))
                            ) : (
                                <MenuItem value="no value">No chapter selected</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Question Category"
                            select
                            value={state.question_cat}
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
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={() => {
                                console.log(state);
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </CssBaseline>
    );
}
