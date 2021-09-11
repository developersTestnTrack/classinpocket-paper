import { forwardRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useState, useReducer } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { parseISO, add, formatISO } from "date-fns";
import {
    TextField,
    FormControlLabel,
    Switch,
    MenuItem,
    Grid,
    Container,
    Button,
    Dialog,
    Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import ChipInput from "material-ui-chip-input";

import Snack from "@/components/Snack";
import { Progress } from "@/components/Common";
import { validatePaperForm } from "@/utils/validation";

const QuestionEditor = dynamic(() => import("@/components/exam-paper-generate/QuestionEditor"), {
    loading: function loading() {
        return <Progress />;
    },
});

const QuizoPdfUploadPanel = dynamic(() => import("@/components/exam-paper-generate/QuizoPdfUploadPanel"), {
    loading: function loading() {
        return <Progress />;
    },
});

const ExamaniaPdfUploadPanel = dynamic(() => import("@/components/exam-paper-generate/ExamaniaPdfUploadPanel"), {
    loading: function loading() {
        return <Progress />;
    },
});

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    list: {
        maxHeight: theme.spacing(35),
    },
    paper: {
        backgroundColor: "#eceff1",
    },
}));

function RenderPanel({ paperDetails }) {
    const { config } = paperDetails;
    const { paperType, questionType } = config;

    if (paperType === "Quizo" && questionType === "Pdf") {
        return <QuizoPdfUploadPanel paperDetails={paperDetails} />;
    }

    if (paperType === "Examania" && questionType === "Pdf") {
        return <ExamaniaPdfUploadPanel paperDetails={paperDetails} />;
    }

    return <QuestionEditor paperDetails={paperDetails} />;
}

export default function PaperDetail({ details }) {
    const classes = useStyles();
    const { subject_list, board, class_name, section, teacher_list, student_list, id } = details;
    const [snack, setSnack] = useState({ open: false, msg: "", status: "idle" });
    const [selectAll, setSelectAll] = useState(false);
    const [openDialog, setDialog] = useState(false);

    const [form, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "config": {
                    return { ...state, config: { ...state.config, ...action.value } };
                }

                case "subject": {
                    return { ...state, subjectList: action.value };
                }

                case "topic": {
                    return {
                        ...state,
                        topicList: action.value,
                    };
                }

                case "teacher": {
                    return {
                        ...state,
                        teacherId: action.value,
                    };
                }

                case "student": {
                    return {
                        ...state,
                        studentId: action.value,
                    };
                }
            }
        },
        {
            board: board,
            class: class_name,
            class_id: id,
            section: section,
            subjectList: subject_list,
            topicList: [],
            config: {
                name: "",
                submissionTime: "10",
                questionType: "",
                paperType: "Quizo",
                paperRejoin: "3",
                examType: "",
                totalMarks: "",
                testType: "",
                duration: "15",
                numberOfQuestions: "",
                startTime: formatISO(new Date()),
                endTime: formatISO(new Date()),
                datetime: formatISO(new Date()),
            },
            teacherId: "",
            studentId: [],
        }
    );

    useEffect(() => {
        console.log(form);
    });

    const handleDateChange = (type, date) => {
        if (type === "start") {
            dispatch({ type: "config", value: { startTime: formatISO(date), datetime: formatISO(date) } });
        }

        if (type === "end") {
            dispatch({ type: "config", value: { endTime: formatISO(date) } });
        }
    };

    return (
        <Container maxWidth="md" style={{ backgroundColor: "#eceff1" }}>
            <Grid container spacing={4}>
                <Grid item xs={12}></Grid>
                <Grid item md={3}>
                    {/* paper type */}
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Select Paper Type"
                        value={form.config.paperType}
                        onChange={(e) => {
                            dispatch({
                                type: "config",
                                value: { paperType: e.target.value, questionType: "" },
                            });
                        }}
                    >
                        <MenuItem value="Examania" key="Examania">
                            Examania
                        </MenuItem>
                        <MenuItem value="Quizo" key="Quizo">
                            Quizo
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item md={3}>
                    {/* paper question type */}
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Select Question Type"
                        value={form.config.questionType}
                        onChange={(e) => {
                            dispatch({
                                type: "config",
                                value: { questionType: e.target.value },
                            });
                        }}
                    >
                        <MenuItem value="Pdf" key="Pdf">
                            Pdf
                        </MenuItem>
                        <MenuItem value="Individual" key="Individual">
                            Individual
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item md={3}>
                    {/* paper exam type */}
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Select Exam Type"
                        value={form.config.examType}
                        onChange={(e) => {
                            dispatch({
                                type: "config",
                                value: { examType: e.target.value },
                            });
                        }}
                    >
                        <MenuItem value="Test" key="Test">
                            Test
                        </MenuItem>
                        <MenuItem value="Practice" key="Practice">
                            Practice
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item md={3}>
                    {/* paper test type */}
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Select Test Type"
                        value={form.config.testType}
                        onChange={(e) => {
                            dispatch({
                                type: "config",
                                value: { testType: e.target.value },
                            });
                        }}
                    >
                        {details.paper_cat_list.map((ele) => (
                            <MenuItem value={ele} key={ele}>
                                {ele}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item md={6}>
                    {/* paper name */}
                    <TextField
                        fullWidth
                        label="Paper Name"
                        variant="outlined"
                        value={form.config.name}
                        onChange={(e) => {
                            dispatch({
                                type: "config",
                                value: { name: e.target.value },
                            });
                        }}
                    />
                </Grid>
                <Grid item md={6}>
                    {/* paper total marks */}
                    <TextField
                        fullWidth
                        type="number"
                        label="Total Marks"
                        variant="outlined"
                        value={form.config.totalMarks}
                        onChange={(e) => {
                            const value = e.target.value;
                            // const numberRegx = /^(\s*|\d+)$/;
                            dispatch({
                                type: "config",
                                value: { totalMarks: value },
                            });
                            // if (value.match(numberRegx)) {
                            // }
                        }}
                    />
                </Grid>
                <Grid item md={12}>
                    {/* paper subject */}
                    <TextField
                        fullWidth
                        select
                        SelectProps={{
                            multiple: true,
                        }}
                        variant="outlined"
                        label="Select Subject"
                        value={form.subjectList}
                        onChange={(e) => {
                            dispatch({ type: "subject", value: e.target.value });
                        }}
                    >
                        {subject_list.map((subject) => {
                            return (
                                <MenuItem key={subject} value={subject}>
                                    {subject}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    {/* paper topics */}
                    <ChipInput
                        fullWidth
                        variant="outlined"
                        label="Enter Topics"
                        placeholder="Type topic name then press enter key"
                        defaultValue={form.topicList}
                        onChange={(value) => {
                            dispatch({ type: "topic", value: value });
                        }}
                    />
                </Grid>
                <Grid item md={form.config.paperType.toLowerCase() === "examania" ? 3 : 6}>
                    {/* paper start time */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            fullWidth
                            disablePast
                            showTodayButton
                            label="Paper Start Time"
                            inputVariant="outlined"
                            value={form.config.startTime}
                            name="start"
                            onChange={(date) => {
                                if (date > new Date()) {
                                    handleDateChange("start", date);
                                } else {
                                    setSnack({
                                        open: true,
                                        status: "error",
                                        msg: "Please check time.",
                                    });
                                }
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={3}>
                    {/* paper duration */}
                    <TextField
                        fullWidth
                        type="number"
                        label="Paper Durations"
                        placeholder="In Min"
                        variant="outlined"
                        value={form.config.duration}
                        onChange={(event) => {
                            const time = event.target.value;
                            // const numberRegx = /^(\s*|\d+)$/;

                            const end = add(parseISO(form.config.datetime), { minutes: Number(time) });
                            dispatch({ type: "config", value: { duration: time, endTime: formatISO(end) } });

                            // if (time.match(numberRegx)) {
                            // }
                        }}
                    />
                </Grid>
                {form.config.paperType.toLowerCase() === "examania" && (
                    <Grid item md={3}>
                        {/* paper submission time */}
                        <TextField
                            fullWidth
                            label="Submission Time"
                            placeholder="In Min"
                            variant="outlined"
                            value={form.config.submissionTime}
                            onChange={(e) => {
                                const value = e.target.value;
                                const numberRegx = /^(\s*|\d+)$/;

                                if (value.match(numberRegx)) {
                                    dispatch({
                                        type: "config",
                                        value: { submissionTime: value },
                                    });
                                }
                            }}
                        />
                    </Grid>
                )}

                <Grid item md={3}>
                    {/* paper rejoin */}
                    <TextField
                        fullWidth
                        type="number"
                        label="Paper Rejoin"
                        variant="outlined"
                        value={form.config.paperRejoin}
                        onChange={(e) => {
                            const value = e.target.value;
                            // const numberRegx = /^(\s*|\d+)$/;

                            dispatch({
                                type: "config",
                                value: { paperRejoin: value },
                            });
                            // if (value.match(numberRegx)) {
                            // }
                        }}
                    />
                </Grid>
                <Grid item md={3}>
                    {/* number of questions */}
                    <TextField
                        fullWidth
                        type="number"
                        variant="outlined"
                        placeholder="Questions"
                        label="Number of Questions"
                        value={form.config.numberOfQuestions}
                        onChange={(event) => {
                            dispatch({ type: "config", value: { numberOfQuestions: event.target.value } });
                        }}
                    />
                </Grid>
                <Grid item md={3}>
                    {/* paper teacher */}
                    <TextField
                        fullWidth
                        select
                        variant="outlined"
                        label="Select Teacher"
                        value={form.teacherId}
                        onChange={(e) => {
                            dispatch({ type: "teacher", value: e.target.value });
                        }}
                    >
                        {teacher_list.map((el) => (
                            <MenuItem key={el.id} value={el.id}>
                                {el.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item md={6}>
                    {/* paper student */}
                    <TextField
                        fullWidth
                        select
                        SelectProps={{
                            multiple: true,
                            displayEmpty: true,
                            MenuProps: { classes: { list: classes.list } },
                        }}
                        disabled={selectAll}
                        variant="outlined"
                        label="Select Student"
                        value={form.studentId}
                        onChange={(e) => {
                            dispatch({ type: "student", value: e.target.value });
                        }}
                    >
                        {student_list.map((el) => (
                            <MenuItem key={el.id} value={el.id}>
                                {el.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        label="All students"
                        control={
                            <Switch
                                color="primary"
                                value={selectAll}
                                onChange={() => {
                                    setSelectAll((prev) => !prev);
                                    dispatch({ type: "student", value: [] });
                                }}
                            />
                        }
                    />
                </Grid>
                <Grid item md={6}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            console.log(form);
                            const errors = validatePaperForm(form);
                            console.log(errors);
                            if (errors) {
                                setSnack({
                                    open: true,
                                    status: "error",
                                    msg: "Please check all the enteries or try to refresh the page",
                                });
                            } else {
                                setDialog(true);
                            }
                        }}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
            <Dialog
                keepMounted={false}
                fullScreen
                classes={{
                    paper: classes.paper,
                }}
                TransitionComponent={Transition}
                open={openDialog}
                onClose={() => setDialog(false)}
            >
                <RenderPanel paperDetails={form} />
                {/* <Container maxWidth="xl">
                </Container> */}
            </Dialog>
            <Snack
                open={snack.open}
                onClose={() => {
                    setSnack((prevState) => ({ ...prevState, open: false }));
                }}
                status={snack.status}
                msg={snack.msg}
            />
        </Container>
    );
}
