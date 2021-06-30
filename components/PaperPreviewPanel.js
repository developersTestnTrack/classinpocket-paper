import {
    Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Container,
    Paper,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import clsx from "clsx";
import { format, differenceInMinutes } from "date-fns";

const useStylesForQuestionView = makeStyles((theme) => ({
    option: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    questionHeading: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: "30%",
        flexShrink: 0,
    },
    questionHeadingSmall: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: "auto",
        flexShrink: 0,
    },
    questionSecondryHeading: {
        padding: theme.spacing(0, 3),
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    optionTextContainer: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1),
        border: "2px solid black",
        borderRadius: "3px",
    },
    optionCorrectTextContainer: {
        border: "2px solid green",
    },
}));

function QuestionView({ questionNumber, paperType, data }) {
    const classes = useStylesForQuestionView();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                    variant="h6"
                    className={clsx(classes.questionHeading, { [classes.questionHeadingSmall]: matches })}
                >
                    Question: {questionNumber}
                </Typography>
                <Typography variant="subtitle1" className={classes.questionSecondryHeading}>
                    Time: {data.question_time} min
                </Typography>
                <Typography variant="subtitle1" className={classes.questionSecondryHeading}>
                    Marks: {data.question_marks}
                </Typography>
                <Typography variant="subtitle1" className={classes.questionSecondryHeading}>
                    Subject: {data.subject}({data.topics})
                </Typography>
                <Typography variant="subtitle1" className={classes.questionSecondryHeading}>
                    Option Type: {data.question.option_type}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div dangerouslySetInnerHTML={{ __html: data.question.text }} />
            </AccordionDetails>

            {paperType !== "examania" && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.questionHeading}>Options</Typography>
                        <Typography className={classes.questionSecondryHeading}>
                            Answer:
                            {data.question_options
                                .map((op, i) => ({ ...op, rank: ++i }))
                                .filter((op) => op.value)
                                .map((op) => op.rank)
                                .join(", ")}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={classes.option}>
                            {data.question_options.map((op, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={clsx(classes.optionTextContainer, {
                                            [classes.optionCorrectTextContainer]: op.value,
                                        })}
                                    >
                                        <Typography variant="subtitle2">Option: {++i}</Typography>
                                        <div dangerouslySetInnerHTML={{ __html: op.text }}></div>
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionDetails>
                </Accordion>
            )}
        </Accordion>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        height: "90vh",
    },
    grid: {
        height: "100%",
    },
    paper: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export default function PaperPreviewPanel({ data }) {
    const classes = useStyles();
    console.log(data);
    return (
        <Container classes={{ root: classes.container }} maxWidth="xl">
            <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={2}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" align="center">
                            Academics
                        </Typography>
                        <Typography align="center">Board: {data.paper.board}</Typography>
                        <Typography align="center">Class: {data.paper.class_name}</Typography>
                        <Typography align="center">Section: {data.paper.section}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" align="center">
                            Paper Details
                        </Typography>
                        <Typography align="center">Paper Title: {data.paper.paper_name}</Typography>
                        <Typography align="center">Paper Rejoin: {data.paper.paper_rejoin}</Typography>
                        <Typography align="center">Submission Time: {data.paper.submission_time}min</Typography>
                        <Typography align="center">Total Marks: {data.paper.paper_total_marks}</Typography>
                        <Typography align="center">
                            Duration:{" "}
                            {differenceInMinutes(new Date(data.paper.end_time), new Date(data.paper.start_time))}
                            min
                        </Typography>
                        <Typography align="center">Subject: {data.paper.subject_list.join(", ")}</Typography>
                        <Typography align="center">Topic: {data.paper.topic_list.join(", ")}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" align="center">
                            Type
                        </Typography>
                        <Typography align="center">Paper Type: {data.paper.paper_type}</Typography>
                        <Typography align="center">Question Type: {data.paper.question_type}</Typography>
                        <Typography align="center">Test Type: {data.paper.test_type}</Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" align="center">
                            Timing
                        </Typography>
                        <Typography align="center">
                            Date: {format(new Date(data.paper.start_time), "dd/MM/yyyy")}
                        </Typography>
                        <Typography align="center">
                            Time: {format(new Date(data.paper.start_time), "hh:mm aaa")}
                        </Typography>
                    </Paper>
                </Grid>
                {data.paper.question_type === "Pdf" ? (
                    <Grid item xs={10}>
                        <iframe src={data.paper.pdf.paper_pdf} title="pdf viewer" width="100%" height="100%" />
                    </Grid>
                ) : (
                    <Grid item xs={10}>
                        {data.paper.questions.map((question, i) => (
                            <QuestionView
                                key={i}
                                questionNumber={question.question_no}
                                paperType={data.paper.paper_type.toLowerCase()}
                                data={question}
                            />
                        ))}
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
