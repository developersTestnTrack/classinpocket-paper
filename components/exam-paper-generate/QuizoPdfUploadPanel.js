import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import {
    Typography,
    TextField,
    Button,
    Grid,
    Container,
    Paper as MuiPaper,
    Dialog,
    DialogContent,
    DialogContentText,
    Avatar,
    Zoom,
    AppBar,
    Toolbar,
} from "@material-ui/core";
import { Info as InfoIcon } from "@material-ui/icons";
import { styled, makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";

import Snack from "@/components/Snack";
import { Progress } from "@/components/Common";
import { openFile } from "@/utils/utils";
import { uploadPdfPaper } from "@/utils/api/firebase-api/mutation";

const Paper = styled(MuiPaper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    border: "0.5px solid black",
    backgroundColor: "transparent",
}));

function PdfSelectBlock({ isSelect, name, value, onClick }) {
    const shortenName = (str) => {
        if (str.length < 15) {
            return str;
        }

        return str.slice(0, 15).concat("...");
    };

    return (
        <Paper elevation={0}>
            <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => {
                    onClick();
                }}
            >
                Select pdf
            </Button>
            <div style={{ flex: 1 }}>
                {isSelect ? (
                    <Typography variant="h5" align="center">
                        {shortenName(name)}
                    </Typography>
                ) : (
                    <Typography variant="h5" align="center">
                        {value}
                    </Typography>
                )}
            </div>
        </Paper>
    );
}

const useSingleOptionStyles = makeStyles((theme) => ({
    avatar: {
        color: "black",
        backgroundColor: (props) => (props.isSelected ? orange[500] : "white"),
        cursor: "pointer",
        fontSize: theme.spacing(3),
        height: theme.spacing(6),
        width: theme.spacing(6),
        // transition: "background-color 0.4s ease-in-out",
    },
}));

function SingleOption({ value, isSelected, onClickOption }) {
    const classes = useSingleOptionStyles({ isSelected });

    const onClick = () => {
        onClickOption();
    };

    if (isSelected) {
        return (
            <Zoom in={isSelected}>
                <Avatar className={classes.avatar} onClick={onClick}>
                    <Typography>{value}</Typography>
                </Avatar>
            </Zoom>
        );
    }

    return (
        <Avatar className={classes.avatar} onClick={onClick}>
            <Typography>{value}</Typography>
        </Avatar>
    );
}

export default function PdfUpload({ paperDetails }) {
    const router = useRouter();
    const { params } = router.query;

    const [pdf, setPdf] = useState({
        numberOfQuestion: paperDetails.config.numberOfQuestions,
        paperPdf: "",
        solutionPdf: "",
        solutionVideo: "link",
        perQuestionMarks: "",
        negativeMarks: "",
    });
    const [loader, setLoader] = useState({ show: false, msg: "" });
    const [questinPdf, setQuestionPdf] = useState({ blob: null, name: "", isSelect: false });
    const [solutionPdf, setSolutionPdf] = useState({ blob: null, name: "", isSelect: false });
    const [questionMarksList, setQuestionMarksList] = useState([]);
    const [snack, setSnackState] = useState({ open: false, msg: "", status: "" });

    const { mutate, isError, isLoading } = useMutation("upload-paper", uploadPdfPaper, {
        onMutate: () => {
            setLoader({ show: true });
        },
        onSuccess: (data) => {
            console.log(data);
            window.location.reload();
        },
        onError: (err) => {
            console.log(err);
        },
        onSettled: () => {
            setLoader({ show: false });
        },
    });

    useEffect(() => {
        const newArray = [];
        for (let index = 1; index <= Number(pdf.numberOfQuestion); index++) {
            newArray.push({ id: index, marks: [] });
        }

        setQuestionMarksList(newArray);
    }, []);

    const onClickSubmit = async () => {
        const paper = {
            board: paperDetails.board,
            class_name: paperDetails.class,
            class_id: paperDetails.class_id,
            section: paperDetails.section,
            subject_list: paperDetails.subjectList,
            topic_list: paperDetails.topicList,
            paper_name: paperDetails.config.name,
            start_time: paperDetails.config.startTime,
            end_time: paperDetails.config.endTime,
            submission_time: Number(paperDetails.config.submissionTime),
            paper_total_marks: Number(paperDetails.config.totalMarks),
            paper_rejoin: Number(paperDetails.config.paperRejoin),
            paper_type: paperDetails.config.paperType,
            test_type: paperDetails.config.testType,
            question_type: paperDetails.config.questionType,
            exam_type: paperDetails.config.examType,
            student_id: paperDetails.studentId,
            teacher_id: paperDetails.teacherId,
            pdf: {
                number_of_question: Number(pdf.numberOfQuestion),
                per_question_marks: questionMarksList.map(() => Number(pdf.perQuestionMarks)),
                negative_mark_per_que: pdf.negativeMarks < 0 ? Number(pdf.negativeMarks) : -Number(pdf.negativeMarks),
                paper_pdf: "",
                solution_pdf: "",
                solution_video: pdf.solutionVideo,
                answer_key: Object.fromEntries(questionMarksList.map((value, i) => [i, value.marks])),
            },
        };

        if (!questinPdf.isSelect) {
            setSnackState({ open: true, msg: "Please select question pdf", status: "error" });
        } else if (questionMarksList.every((ele) => ele.marks.length === 0)) {
            setSnackState({ open: true, msg: "Please fill all the options", status: "error" });
        } else if (pdf.perQuestionMarks.length === 0 || pdf.negativeMarks.length === 0) {
            setSnackState({ open: true, msg: "Please fill marks", status: "error" });
        } else if (Object.values(paper.pdf.answer_key).some((el) => el.length === 0)) {
            setSnackState({ open: true, msg: "Please fill all options", status: "error" });
        } else {
            mutate({
                paper: paper,
                question_pdf_blob: questinPdf.blob,
                solution_pdf_blob: solutionPdf.blob,
                school_id: params[0],
            });
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" style={{ flex: 1 }}>
                        Pdf Paper
                    </Typography>
                    <Button variant="text" onClick={onClickSubmit}>
                        Submit Paper
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}></Grid>

                            {/* select pdf  */}
                            <Grid item xs={6}>
                                <Typography variant="h5">Question PDF</Typography>
                                <PdfSelectBlock
                                    value="Question Pdf"
                                    isSelect={questinPdf.isSelect}
                                    name={questinPdf.name}
                                    onClick={() => {
                                        openFile().then((blob) => {
                                            setQuestionPdf({ blob: blob, name: blob.name, isSelect: true });
                                        });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h5">Solution PDF</Typography>
                                <PdfSelectBlock
                                    value="Solution Pdf"
                                    isSelect={solutionPdf.isSelect}
                                    name={solutionPdf.name}
                                    onClick={() => {
                                        openFile().then((blob) => {
                                            setSolutionPdf({ blob: blob, name: blob.name, isSelect: true });
                                        });
                                    }}
                                />
                            </Grid>

                            {/* Enter video solution link */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    label="Solution link"
                                    placeholder="Enter video solution link"
                                    value={pdf.solutionVideo}
                                    onChange={(e) => {
                                        setPdf((prevState) => ({ ...prevState, solutionVideo: e.target.value }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    label="Question marks"
                                    placeholder="Per question marks"
                                    value={pdf.perQuestionMarks}
                                    onChange={(e) => {
                                        setPdf((prevState) => ({ ...prevState, perQuestionMarks: e.target.value }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    label="Negative marks"
                                    placeholder="Per question negative marks"
                                    value={pdf.negativeMarks}
                                    onChange={(e) => {
                                        setPdf((prevState) => ({ ...prevState, negativeMarks: e.target.value }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="h5">Enter option for each question :</Typography>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <InfoIcon size="small" style={{ padding: "2px" }} />
                                    <Typography variant="caption">
                                        You can only enter one option : A, B, C, D
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={6}></Grid>

                            {/* Per question options */}
                            {questionMarksList.length !== 0 && (
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        {questionMarksList.length !== 0 &&
                                            questionMarksList.map(({ id, marks }, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={4}>
                                                            <Typography variant="h6" align="justify">
                                                                Question {id}
                                                            </Typography>
                                                        </Grid>
                                                        {["A", "B", "C", "D"].map((value, i) => {
                                                            return (
                                                                <Grid item key={i} xs={2}>
                                                                    <SingleOption
                                                                        value={value}
                                                                        isSelected={marks.includes(value.toUpperCase())}
                                                                        onClickOption={() => {
                                                                            const tempList = [...questionMarksList];

                                                                            if (!marks.includes(value.toUpperCase())) {
                                                                                tempList[index] = {
                                                                                    id,
                                                                                    marks: [value.toUpperCase()],
                                                                                };
                                                                                setQuestionMarksList(tempList);
                                                                            } else {
                                                                                tempList[index] = {
                                                                                    id,
                                                                                    marks: [],
                                                                                };
                                                                                setQuestionMarksList(tempList);
                                                                            }
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                    {/* <TextField
                                                    fullWidth
                                                    inputProps={{ maxLength: 1 }}
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="Question Option"
                                                    label={`Question ${id}`}
                                                    value={marks}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const tempList = [...questionMarksList];
                                                        console.log(value);

                                                        if (value.length === 0) {
                                                            tempList[i] = { id, marks: "" };
                                                            setQuestionMarksList(tempList);
                                                        }

                                                        if (["A", "B", "C", "D"].includes(value.toUpperCase())) {
                                                            tempList[i] = { id, marks: value.toUpperCase() };
                                                            setQuestionMarksList(tempList);
                                                        }
                                                    }}
                                                /> */}
                                                </Grid>
                                            ))}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog open={loader.show}>
                    <DialogContent>
                        {isLoading && <Progress />}
                        {isError ? (
                            <DialogContentText>Something went wrong please try again later.</DialogContentText>
                        ) : (
                            <DialogContentText>Please wait it will take some time.</DialogContentText>
                        )}
                    </DialogContent>
                </Dialog>
                <Snack
                    open={snack.open}
                    onClose={() => setSnackState(() => ({ open: false, status: "", msg: "" }))}
                    status={snack.status}
                    msg={snack.msg}
                />
            </Container>
        </>
    );
}
