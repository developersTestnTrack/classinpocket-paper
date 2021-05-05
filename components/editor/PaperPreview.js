import { Typography, Container, IconButton, Grid, TextField } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { useEditor } from "./editorUtil";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(0.5),
    },
    question: {
        width: "100%",
        border: "1px solid black",
        borderRadius: "10px",
        padding: theme.spacing(1),
        minHeight: theme.spacing(30),
        overflow: "auto",
        marginBottom: theme.spacing(1),
    },
    options: {
        width: "100%",
        border: "1px solid black",
        borderRadius: "10px",
        padding: theme.spacing(1),
        minHeight: theme.spacing(20),
    },
    highlightOption: {
        width: "100%",
        border: "5px solid green",
        borderRadius: "10px",
        padding: theme.spacing(1),
        minHeight: theme.spacing(20),
    },
    headerText: {
        marginBottom: theme.spacing(3),
    },
}));

function QuestionListRender({ list }) {
    const classes = useStyles();
    return list.map((question) => {
        const { text, config, options } = question;

        return (
            <Grid item xs={12}>
                <div className={classes.question} dangerouslySetInnerHTML={{ __html: text }} />
            </Grid>
        );
    });
}

export default function PaperPreview({ onClose }) {
    const classes = useStyles();
    const [state] = useEditor();
    const { list, paper } = state;
    console.log(list, paper);

    return (
        <Container maxWidth="xl" className={classes.container}>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h4" align="center" className={classes.headerText}>
                Paper Preview
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Paper Name"
                                disabled
                                defaultValue={paper.config.name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Exam Name"
                                disabled
                                defaultValue={paper.config.examType}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Paper Duration"
                                disabled
                                defaultValue={paper.config.paperDuration}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Paper Type"
                                disabled
                                defaultValue={paper.config.paperType}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Question Type"
                                disabled
                                defaultValue={paper.config.questionType}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Test Type"
                                disabled
                                defaultValue={paper.config.testType}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Paper Total Marks"
                                disabled
                                defaultValue={paper.config.totalMarks}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Grid container>
                        <QuestionListRender list={list} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
