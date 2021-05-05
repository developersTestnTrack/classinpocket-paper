import { useState } from "react";
import { useQuery } from "react-query";
import { parseISO, differenceInMinutes } from "date-fns";

import {
    Typography,
    List,
    Paper,
    ListSubheader,
    ListItem,
    TextField,
    MenuItem,
    ListItemText,
    Grid,
} from "@material-ui/core";

import { getName } from "@/utils/api/all";
import SubmitPanel from "./SubmitPanel";
import { useEditor } from "./editorUtil";

export default function QuestionDetailPanel() {
    const [state, dispatch] = useEditor();
    const { question, edit, paper, list: questionList } = state;

    const [list, setList] = useState({ subject: [], course: [] });

    const { isLoading } = useQuery(
        "getnames",
        () => getName({ subjectId: state.paper.subject.subjectId, courseId: state.paper.course.courseId }),
        {
            refetchOnWindowFocus: false,
            onSuccess: (result) => {
                if (result.status) {
                    setList({ subject: result.data.Subject, course: result.data.Course });
                }
            },
        }
    );

    console.log(list);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <List
                    component={Paper}
                    subheader={
                        <ListSubheader component="div" id="details-list">
                            <Typography variant="h5" align="center">
                                Question Details
                            </Typography>
                        </ListSubheader>
                    }
                >
                    <ListItem>
                        <TextField
                            fullWidth
                            size="small"
                            label="Time"
                            placeholder="Question Time in Min"
                            variant="outlined"
                            value={question.config.time}
                            onChange={(e) => {
                                const value = e.target.value;
                                const numberRegx = /^(\s*|\d+)$/;

                                if (value.match(numberRegx)) {
                                    dispatch({
                                        type: "UPDATE_CONFIG",
                                        config: {
                                            time: value,
                                        },
                                    });
                                }
                            }}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            size="small"
                            label="Marks"
                            placeholder="Question Marks"
                            variant="outlined"
                            value={question.config.marks}
                            onChange={(e) => {
                                const value = e.target.value;
                                const numberRegx = /^(\s*|\d+)$/;

                                if (value.match(numberRegx)) {
                                    dispatch({
                                        type: "UPDATE_CONFIG",
                                        config: {
                                            marks: value,
                                        },
                                    });
                                }
                            }}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            size="small"
                            label="Pdf"
                            placeholder="Pdf Solution Link"
                            variant="outlined"
                            value={question.config.pdf}
                            onChange={(e) => {
                                dispatch({
                                    type: "UPDATE_CONFIG",
                                    config: {
                                        pdf: e.target.value,
                                    },
                                });
                            }}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            size="small"
                            label="Video"
                            placeholder="Video Solution Link"
                            variant="outlined"
                            value={question.config.video}
                            onChange={(e) => {
                                dispatch({
                                    type: "UPDATE_CONFIG",
                                    config: {
                                        video: e.target.value,
                                    },
                                });
                            }}
                        />
                    </ListItem>
                    {paper.config.paperType !== "Examania" ? (
                        <ListItem>
                            <TextField
                                fullWidth
                                select
                                label="Select Type"
                                variant="outlined"
                                size="small"
                                value={question.config.type}
                                onChange={(e) => {
                                    dispatch({
                                        type: "UPDATE_CONFIG",
                                        config: {
                                            type: e.target.value,
                                        },
                                    });
                                }}
                            >
                                <MenuItem value="Multiple" key="Multiple">
                                    Multiple
                                </MenuItem>
                                <MenuItem value="Single" key="Single">
                                    Single
                                </MenuItem>
                            </TextField>
                        </ListItem>
                    ) : (
                        <div></div>
                    )}

                    {isLoading ? (
                        <ListItem>
                            <ListItemText>
                                <Typography variant="h5" align="center">
                                    Fetching...
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    ) : (
                        <>
                            <ListItem>
                                <TextField
                                    fullWidth
                                    select
                                    label="Select Subject"
                                    size="small"
                                    variant="outlined"
                                    value={question.config.subjectId}
                                    onChange={(e) => {
                                        dispatch({
                                            type: "UPDATE_CONFIG",
                                            config: {
                                                subjectId: e.target.value,
                                            },
                                        });
                                    }}
                                >
                                    {list.subject.map((el, i) => {
                                        return (
                                            <MenuItem value={el.subject_id} key={i}>
                                                {el.subject_name}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </ListItem>
                            <ListItem>
                                <TextField
                                    fullWidth
                                    select
                                    label="Select Course"
                                    size="small"
                                    variant="outlined"
                                    value={question.config.courseId}
                                    onChange={(e) => {
                                        dispatch({
                                            type: "UPDATE_CONFIG",
                                            config: {
                                                courseId: e.target.value,
                                            },
                                        });
                                    }}
                                >
                                    {list.course.map((el, i) => {
                                        return (
                                            <MenuItem value={el.course_id} key={i}>
                                                {el.course_name}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </ListItem>
                        </>
                    )}
                </List>
            </Grid>
            <Grid item xs={12}>
                <List component={Paper} disablePadding>
                    <ListItem>
                        <ListItemText>
                            <Typography variant="h6" align="center">
                                Total Marks
                            </Typography>
                            <Typography variant="h6" align="center">
                                {questionList.reduce((acc, curr) => acc + Number(curr.config.marks), 0)}/
                                {paper.config.totalMarks}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>
                            <Typography variant="h6" align="center">
                                Total Time
                            </Typography>
                            <Typography variant="h6" align="center">
                                {questionList.reduce((acc, curr) => acc + Number(curr.config.time), 0)}/
                                {differenceInMinutes(parseISO(paper.config.endTime), parseISO(paper.config.startTime))}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={12}>
                {edit.isEditing ? <div></div> : <SubmitPanel />}
            </Grid>
        </Grid>
    );
}
