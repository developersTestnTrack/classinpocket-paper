import { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import {
    Typography,
    TextField,
    Button,
    Grid,
    Container,
    Paper as MuiPaper,
    InputAdornment,
    Dialog,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";

import { styled } from "@material-ui/core/styles";

import { Progress } from "@/components/Common";
import { openFile } from "@/utils/utils";
import { uploadPdfPaper } from "@/utils/api/firebase-api/mutation";

const Paper = styled(MuiPaper)(({ theme }) => ({ padding: theme.spacing(2), display: "flex" }));

export default function PdfUpload({ paperDetails }) {
    const router = useRouter();
    const { params } = router.query;

    const [pdf, setPdf] = useState({
        numberOfQuestion: "",
        perQuestionMarks: [],
        paperPdf: "",
        solutionPdf: "",
        solutionVideo: "",
    });
    const [loader, setLoader] = useState({ show: false });
    const [questinPdf, setQuestionPdf] = useState({ blob: null, name: "", isSelect: false });
    const [solutionPdf, setSolutionPdf] = useState({ blob: null, name: "", isSelect: false });
    const [questionMarksList, setQuestionMarksList] = useState([]);

    const { mutate } = useMutation("upload paper", uploadPdfPaper, {
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

    const createList = () => {
        const newArray = [];

        for (let index = 1; index <= Number(pdf.numberOfQuestion); index++) {
            newArray.push({ id: index, marks: "" });
        }

        setQuestionMarksList(newArray);
    };

    const onClickSubmit = async () => {
        const pdfConfig = {
            ...pdf,
            perQuestionMarks: questionMarksList.map((el) => Number(el.marks)),
        };

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
                number_of_question: Number(pdfConfig.numberOfQuestion),
                per_question_marks: pdfConfig.perQuestionMarks,
                paper_pdf: "",
                solution_pdf: "",
                solution_video: pdfConfig.solutionVideo,
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
        <Container>
            <Grid container>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} />

                        {/* select pdf  */}
                        <Grid item xs={6}>
                            <Paper>
                                <Button
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
                                        <Typography variant="h5" align="center">
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
                            <Paper>
                                <Button
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
                                        <Typography variant="h5" align="center">
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
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Solution link"
                                placeholder="Enter video solution link"
                                value={pdf.solutionVideo}
                                onChange={(e) => {
                                    setPdf((prevState) => ({ ...prevState, solutionVideo: e.target.value }));
                                }}
                            />
                        </Grid>

                        {/* Enter total number of questions */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Question Number"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={() => {
                                                    createList();
                                                }}
                                            >
                                                add
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                value={pdf.numberOfQuestion}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const numberRegx = /^(\s*|\d+)$/;

                                    if (value.match(numberRegx)) {
                                        setPdf((prevState) => ({
                                            ...prevState,
                                            numberOfQuestion: e.target.value,
                                        }));
                                    }
                                }}
                            />
                        </Grid>

                        {/* Per question marks */}
                        {questionMarksList.length !== 0 && (
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Enter marks for each question :</Typography>
                                    </Grid>
                                    {questionMarksList.length !== 0 &&
                                        questionMarksList.map(({ id, marks }, i) => (
                                            <Grid item xs={2} key={i}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="Question Marks"
                                                    label={`Question ${id}`}
                                                    value={marks}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const numberRegx = /^(\s*|\d+)$/;

                                                        if (value.match(numberRegx)) {
                                                            const newList = questionMarksList.map((el1) => {
                                                                if (el1.id === id) {
                                                                    return {
                                                                        ...el1,
                                                                        marks: e.target.value,
                                                                    };
                                                                } else {
                                                                    return el1;
                                                                }
                                                            });

                                                            setQuestionMarksList(newList);
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
                    <Progress />
                    <DialogContentText>Please wait it will take some time</DialogContentText>
                </DialogContent>
            </Dialog>
        </Container>
    );
}
