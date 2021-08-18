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
} from "@material-ui/core";

import { Info as InfoIcon } from "@material-ui/icons";
import { styled } from "@material-ui/core/styles";

import { Progress } from "@/components/Common";
import { openFile } from "@/utils/utils";
import { uploadPdfPaper } from "@/utils/api/firebase-api/mutation";

const Paper = styled(MuiPaper)(({ theme }) => ({ padding: theme.spacing(2), display: "flex" }));

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

    const { mutate, isError, isLoading } = useMutation("upload paper", uploadPdfPaper, {
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
            newArray.push({ id: index, marks: "" });
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
                negative_mark_per_que: -Number(pdf.negativeMarks),
                paper_pdf: "",
                solution_pdf: "",
                solution_video: pdf.solutionVideo,
                answer_key: Object.fromEntries(questionMarksList.map((value, i) => [i, [value.marks]])),
            },
        };

        console.log(paper);
        mutate({
            paper: paper,
            question_pdf_blob: questinPdf.blob,
            solution_pdf_blob: solutionPdf.blob,
            school_id: params[0],
        });
    };

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} />

                        {/* select pdf  */}
                        <Grid item xs={6}>
                            <Typography variant="h5">Question Pdf</Typography>
                            <Paper>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        openFile().then((blob) => {
                                            setQuestionPdf({ blob: blob, name: blob.name, isSelect: true });
                                        });
                                    }}
                                >
                                    Select pdf
                                </Button>
                                <div style={{ flex: 1 }}>
                                    {questinPdf.isSelect ? (
                                        <Typography variant="h5" align="center" noWrap>
                                            {questinPdf.name}
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5" align="center">
                                            Select question pdf
                                        </Typography>
                                    )}
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5">Solution Pdf</Typography>
                            <Paper>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        openFile().then((blob) => {
                                            setSolutionPdf({ blob: blob, name: blob.name, isSelect: true });
                                        });
                                    }}
                                >
                                    Select pdf
                                </Button>
                                <div style={{ flex: 1 }}>
                                    {solutionPdf.isSelect ? (
                                        <Typography variant="h5" align="center" noWrap>
                                            {solutionPdf.name}
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5" align="center">
                                            Select solution pdf
                                        </Typography>
                                    )}
                                </div>
                            </Paper>
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
                        <Grid item xs={12}></Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                label="Per Question Marks"
                                placeholder="Enter video solution link"
                                value={pdf.perQuestionMarks}
                                onChange={(e) => {
                                    setPdf((prevState) => ({ ...prevState, perQuestionMarks: e.target.value }));
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                label="Per Question Negative Marks"
                                placeholder="Enter video solution link"
                                value={pdf.negativeMarks}
                                onChange={(e) => {
                                    setPdf((prevState) => ({ ...prevState, negativeMarks: e.target.value }));
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h5">Enter option for each question :</Typography>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <InfoIcon size="small" style={{ padding: "2px" }} />
                                <Typography variant="caption">You can only enter one option : A, B, C, D</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12}></Grid>
                        {/* Per question marks */}
                        {questionMarksList.length !== 0 && (
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    {questionMarksList.length !== 0 &&
                                        questionMarksList.map(({ id, marks }, i) => (
                                            <Grid item xs={2} key={i}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="Question Option"
                                                    label={`Question ${id}`}
                                                    value={marks}
                                                    onChange={(e) => {
                                                        const value = e.target.value;

                                                        if (value.length === 0) {
                                                            const newList = questionMarksList.map((el1) => {
                                                                if (el1.id === id) {
                                                                    return {
                                                                        ...el1,
                                                                        marks: "",
                                                                    };
                                                                } else {
                                                                    return el1;
                                                                }
                                                            });

                                                            setQuestionMarksList(newList);
                                                        }

                                                        if (value.length === 1) {
                                                            if (["A", "B", "C", "D"].includes(value.toUpperCase())) {
                                                                const newList = questionMarksList.map((el1) => {
                                                                    if (el1.id === id) {
                                                                        return {
                                                                            ...el1,
                                                                            marks: value.toUpperCase(),
                                                                        };
                                                                    } else {
                                                                        return el1;
                                                                    }
                                                                });

                                                                setQuestionMarksList(newList);
                                                            }
                                                        }

                                                        if (value.length === 2) {
                                                            const value = e.target.value[1];
                                                            if (["A", "B", "C", "D"].includes(value.toUpperCase())) {
                                                                const newList = questionMarksList.map((el1) => {
                                                                    if (el1.id === id) {
                                                                        return {
                                                                            ...el1,
                                                                            marks: value.toUpperCase(),
                                                                        };
                                                                    } else {
                                                                        return el1;
                                                                    }
                                                                });

                                                                setQuestionMarksList(newList);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                </Grid>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button color="primary" variant="contained" onClick={onClickSubmit}>
                                Submit
                            </Button>
                        </Grid>
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
        </Container>
    );
}
