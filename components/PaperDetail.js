import { useState, useReducer, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import formatISO from "date-fns/formatISO";

import { TextField, FormControlLabel, Switch, MenuItem, Grid, Container, Button } from "@material-ui/core";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

export default function PaperDetail({ details, onFinish }) {
    const { subject_list, board, class_name, section, teacher_list, student_list } = details;

    const [selectAll, setSelectAll] = useState(false);
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
                        topicList: action.value.split(",").map((s) => s.trim().toUpperCase()),
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
            section: section,
            subjectList: subject_list,
            topicList: [],
            config: {
                name: "",
                startTime: formatISO(new Date()),
                endTime: formatISO(new Date()),
                submissionTime: "",
                questionType: "",
                paperType: "",
                paperRejoin: "",
                examType: "",
                totalMarks: "",
                testType: "",
            },
            teacherId: "",
            studentId: [],
        }
    );

    useEffect(() => {
        console.log(form);
        console.log(details);
    });

    const handleDateChange = (type, date) => {
        if (type === "start") {
            dispatch({ type: "config", value: { startTime: formatISO(date) } });
        }

        if (type === "end") {
            dispatch({ type: "config", value: { endTime: formatISO(date) } });
        }
    };

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12}></Grid>
                <Grid item md={6}>
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
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Enter Topics"
                        value={form.topicList.join(" ,")}
                        onChange={(e) => {
                            dispatch({ type: "topic", value: e.target.value });
                        }}
                    />
                </Grid>
                <Grid item md={3}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            fullWidth
                            label="Paper Start Time"
                            inputVariant="outlined"
                            value={form.config.startTime}
                            name="start"
                            onChange={(date) => handleDateChange("start", date)}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={3}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            fullWidth
                            label="Paper End Time"
                            inputVariant="outlined"
                            value={form.config.endTime}
                            name="end"
                            onChange={(date) => handleDateChange("end", date)}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={3}>
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
                <Grid item md={3}>
                    <TextField
                        fullWidth
                        label="Paper Rejoin"
                        variant="outlined"
                        value={form.config.paperRejoin}
                        onChange={(e) => {
                            const value = e.target.value;
                            const numberRegx = /^(\s*|\d+)$/;

                            if (value.match(numberRegx)) {
                                dispatch({
                                    type: "config",
                                    value: { paperRejoin: value },
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid item md={3}>
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Select Paper Type"
                        value={form.config.paperType}
                        onChange={(e) => {
                            dispatch({
                                type: "config",
                                value: { paperType: e.target.value },
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
                        <MenuItem value="Library" key="Library">
                            Library
                        </MenuItem>
                        <MenuItem value="Individual" key="Individual">
                            Individual
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item md={3}>
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
                        <MenuItem value="Chapter Wise" key="Chapter Wise">
                            Chapter Wise
                        </MenuItem>
                        <MenuItem value="Mock Wise" key="Mock Wise">
                            Mock Wise
                        </MenuItem>
                        <MenuItem value="Book Wise" key="Book Wise">
                            Book Wise
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item md={6}>
                    <TextField
                        fullWidth
                        label="Total Marks"
                        variant="outlined"
                        value={form.config.totalMarks}
                        onChange={(e) => {
                            const value = e.target.value;
                            const numberRegx = /^(\s*|\d+)$/;

                            if (value.match(numberRegx)) {
                                dispatch({
                                    type: "config",
                                    value: { totalMarks: value },
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid item md={6}>
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
                    <TextField
                        fullWidth
                        select
                        SelectProps={{ multiple: true }}
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
                </Grid>
                <Grid item md={6}></Grid>
                <Grid item md={6}>
                    <FormControlLabel
                        label="Select All"
                        control={<Switch />}
                        value={selectAll}
                        onChange={() => {
                            dispatch({ type: "student", value: [] });
                            setSelectAll((prev) => !prev);
                        }}
                    />
                </Grid>
                <Grid item md={6}>
                    <Button color="primary" variant="contained" onClick={() => onFinish(form)}>
                        Finish
                    </Button>
                </Grid>
                <Grid item md={6}></Grid>
            </Grid>
        </Container>
    );
}