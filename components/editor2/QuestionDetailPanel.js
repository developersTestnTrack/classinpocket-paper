import { List, Paper, ListItem, TextField, MenuItem, Grid } from "@material-ui/core";

import SubmitPanel from "./SubmitPanel";
import { useEditor } from "./editorUtil";

export default function QuestionDetailPanel() {
    const [state, dispatch] = useEditor();
    const { question, edit, paper } = state;

    return (
        <Grid container spacing={2}>
            {/* 1st section */}
            <Grid item xs={12}>
                <List component={Paper} aria-labelledby="details-list">
                    <ListItem>
                        <TextField
                            fullWidth
                            select
                            label="Select Topic"
                            size="small"
                            variant="outlined"
                            value={question.config.difficulty_level}
                            onChange={(e) => {
                                dispatch({
                                    type: "UPDATE_CONFIG",
                                    config: {
                                        difficulty_level: e.target.value,
                                    },
                                });
                            }}
                        >
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="moderate">Moderate</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </TextField>
                    </ListItem>
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
                    <ListItem>
                        <TextField
                            fullWidth
                            select
                            SelectProps={{ multiple: true }}
                            label="Select Topic"
                            size="small"
                            variant="outlined"
                            value={question.config.topic}
                            onChange={(e) => {
                                dispatch({
                                    type: "UPDATE_CONFIG",
                                    config: {
                                        topic: e.target.value,
                                    },
                                });
                            }}
                        >
                            {paper.topic.map((el, i) => {
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

            <Grid item xs={12}>
                {edit.isEditing ? <div></div> : <SubmitPanel />}
            </Grid>
        </Grid>
    );
}
