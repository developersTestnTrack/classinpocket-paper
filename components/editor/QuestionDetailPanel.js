import { parseISO, differenceInMinutes } from "date-fns";

import { Typography, List, Paper, ListItem, TextField, MenuItem, ListItemText, Grid, Divider } from "@material-ui/core";

import SubmitPanel from "./SubmitPanel";
import { useEditor } from "./editorUtil";

export default function QuestionDetailPanel() {
    const [state, dispatch] = useEditor();
    const { question, edit, paper, list: questionList } = state;

    return (
        <Grid container spacing={2}>
            {/* 1st section */}
            <Grid item xs={12}>
                <List component={Paper} aria-labelledby="details-list">
                    <ListItem>
                        <TextField
                            fullWidth
                            size="small"
                            label="Question Time"
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
                            label="Question Marks"
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
                    {/* <ListItem>
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
                    </ListItem> */}
                    <ListItem>
                        <TextField
                            fullWidth
                            size="small"
                            label="Video Solution Link"
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
                            {paper.subjectList.map((el, i) => {
                                return (
                                    <MenuItem value={el} key={i}>
                                        {el}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            select
                            label="Select Topic"
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
                            {paper.topicList.map((el, i) => {
                                return (
                                    <MenuItem value={el} key={i}>
                                        {el}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </ListItem>
                </List>
            </Grid>

            {/* 2nd section */}
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
                    <Divider />
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

            {/* 3rd section */}
            <Grid item xs={12}>
                {edit.isEditing ? <div></div> : <SubmitPanel />}
            </Grid>
        </Grid>
    );
}
