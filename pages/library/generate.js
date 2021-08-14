import { useReducer, forwardRef } from "react";
import {
    Container,
    Grid,
    CssBaseline,
    TextField,
    MenuItem,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    Slide,
    Paper,
} from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { firestoreDB } from "@/utils/api/firebase-api/fire";
import QuestionList from "@/components/lib-section/QuestionList";

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: "white",
    },
    gridContainer: {
        paddingTop: theme.spacing(2),
    },
    searchBtn: {
        width: "100%",
        margin: "0 auto",
    },
    btnGroup: {
        display: "flex",
        justifyContent: "center",
    },
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export async function getServerSideProps() {
    const lib = await firestoreDB.collection("library").doc("Library topics").get();

    return {
        props: {
            lib: JSON.parse(JSON.stringify(lib.data())),
        },
    };
}

export default function SearchPage({ lib }) {
    const classes = useStyles();

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "BOARD": {
                    return {
                        ...state,
                        board: action.value,
                        klass: "",
                        subject: "",
                        chapter: "",
                        topic: [],
                        search: false,
                    };
                }
                case "KLASS": {
                    return { ...state, klass: action.value, subject: "", chapter: "", topic: [], search: false };
                }
                case "SUBJECT": {
                    return { ...state, subject: action.value, chapter: "", topic: [], search: false };
                }
                case "CHAPTER": {
                    return { ...state, chapter: action.value, topic: [], search: false };
                }
                case "TOPIC": {
                    return { ...state, topic: action.value, search: false };
                }
                case "PAPER_CAT": {
                    if (action.value === "Mock Wise") {
                        return { ...state, paper_cat: action.value, chapter: [] };
                    }

                    if (action.value === "Book Wise") {
                        return {
                            ...state,
                            paper_cat: action.value,
                            chapter: lib.chapter_list
                                .filter(
                                    (obj) =>
                                        obj.board === state.board &&
                                        obj.class === state.klass &&
                                        obj.subject === state.subject
                                )
                                .map((obj) => obj.chapter),
                        };
                    }

                    return { ...state, paper_cat: action.value };
                }
                case "MARKS": {
                    return { ...state, marks: action.value, search: false };
                }
                case "QUESTION_CAT": {
                    return { ...state, question_cat: action.value };
                }
                case "SEARCH": {
                    return { ...state, search: true, openDialog: true };
                }
                case "QUESTIONS": {
                    return { ...state, questions_number: action.value, search: false };
                }
                case "DIALOG": {
                    return { ...state, openDialog: action.value };
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
            search: false,
            questions_number: 0,
            openDialog: false,
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

    return (
        <CssBaseline>
            <div className={classes.wrapper}>
                <Paper className={classes.container}>
                    <Container maxWidth="xs">
                        <Grid container spacing={2} className={classes.gridContainer}>
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
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
                            <Grid item xs={12}>
                                <TextField
                                    disabled={!state.board.length}
                                    size="small"
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
                            <Grid item xs={12}>
                                <TextField
                                    disabled={!state.klass.length}
                                    size="small"
                                    select
                                    fullWidth
                                    variant="outlined"
                                    label="Subject"
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
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    label="Paper Categary"
                                    placeholder="Enter Chapters"
                                    value={state.paper_cat}
                                    onChange={(e) => {
                                        dispatch({ type: "PAPER_CAT", value: e.target.value });
                                    }}
                                >
                                    {["Book Wise", "Chapter Wise", "Mock Wise"].map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {state.paper_cat === "Chapter Wise" && (
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: PaperProps,
                                            },
                                        }}
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
                            )}
                            {state.paper_cat === "Mock Wise" && (
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        select
                                        SelectProps={{
                                            multiple: true,
                                            MenuProps: {
                                                PaperProps: PaperProps,
                                            },
                                        }}
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
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    select
                                    variant="outlined"
                                    label="Paper Marks"
                                    value={state.marks}
                                    onChange={(e) => {
                                        dispatch({ type: "MARKS", value: e.target.value });
                                    }}
                                >
                                    {[25, 50, 80].map((marks) => (
                                        <MenuItem key={marks} value={marks}>
                                            {marks}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} className={classes.btnGroup}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    onClick={() => {
                                        dispatch({ type: "SEARCH" });
                                    }}
                                >
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Dialog
                                    fullScreen
                                    keepMounted={false}
                                    TransitionComponent={Transition}
                                    open={state.openDialog}
                                    onClose={() => dispatch({ type: "DIALOG", value: false })}
                                >
                                    <DialogTitle>
                                        Paper Questions
                                        <Button
                                            style={{ position: "absolute", right: 0, marginRight: "16px" }}
                                            variant="contained"
                                            color="primary"
                                            onClick={() => dispatch({ type: "DIALOG", value: false })}
                                        >
                                            Close
                                        </Button>
                                    </DialogTitle>
                                    <Container maxWidth="md">
                                        {state.search ? (
                                            <QuestionList
                                                filter={{
                                                    ...state,
                                                    chapter: Array.isArray(state.chapter)
                                                        ? state.chapter
                                                        : [state.chapter],
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="h5" align="center">
                                                Not available
                                            </Typography>
                                        )}
                                    </Container>
                                </Dialog>
                            </Grid>
                        </Grid>
                    </Container>
                </Paper>
            </div>
        </CssBaseline>
    );
}
