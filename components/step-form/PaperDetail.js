import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import DateFnsUtils from "@date-io/date-fns";
import formatISO from "date-fns/formatISO";

import { TextField, FormControlLabel, Switch, MenuItem, Grid } from "@material-ui/core";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

import { useStepForm } from "./StepFormContext";
import { Progress } from "../Common";
import { getUsersById } from "@/utils/api/paper";

export default function PaperDetail() {
    const [form, dispatch] = useStepForm();

    const [userList, setUserList] = useState({ teacher: [], student: [] });
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        console.log(form);
    });

    const { isLoading } = useQuery(
        [
            "userList",
            {
                boardId: form.board.boardId,
                classId: form.class.classId,
                batchId: form.batch.batchId,
                subjectId: form.subject.subjectId,
            },
        ],
        () => {
            return getUsersById({
                boardId: form.board.boardId,
                classId: form.class.classId,
                batchId: form.batch.batchId,
                subjectId: form.subject.subjectId,
            });
        },
        {
            onSuccess: (data) => {
                console.log(data);
                setUserList({ teacher: data.teacherlist, student: data.studentlist });
            },
        }
    );

    const handleDateChange = (type, date) => {
        if (type === "start") {
            dispatch({ type: "config", value: { startTime: formatISO(date) } });
        }

        if (type === "end") {
            dispatch({ type: "config", value: { endTime: formatISO(date) } });
        }
    };

    if (isLoading) {
        return <Progress />;
    }

    return (
        <Grid container spacing={4}>
            <Grid item md={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
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
                    select
                    fullWidth
                    variant="outlined"
                    label="Select Teacher"
                    value={form.config.teacherId}
                    onChange={(e) => dispatch({ type: "config", value: { teacherId: e.target.value } })}
                >
                    {userList.teacher.map(({ user_id, name }) => (
                        <MenuItem value={user_id} key={user_id}>
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item md={6}>
                <TextField
                    select
                    fullWidth
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) => {
                            return selected
                                .map((id) => {
                                    const found = userList.student.find(({ user_id }) => user_id === id);
                                    return found.name;
                                })
                                .join(", ");
                        },
                    }}
                    disabled={selectAll}
                    variant="outlined"
                    label="Select Student"
                    value={form.config.studentId}
                    onChange={(event) => {
                        dispatch({ type: "config", value: { studentId: event.target.value } });
                    }}
                >
                    {userList.student.map(({ user_id, name, reg_number }, i) => (
                        <MenuItem value={user_id} key={i}>
                            {`${name} - ${reg_number}`}
                        </MenuItem>
                    ))}
                </TextField>
                <FormControlLabel
                    label="Select All"
                    control={<Switch />}
                    value={selectAll}
                    onChange={() => {
                        dispatch({ type: "config", value: { studentId: [] } });
                        setSelectAll((prev) => !prev);
                    }}
                />
            </Grid>
        </Grid>
    );
}
