import { useState } from "react";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { styled } from "@material-ui/core/styles";

import { Progress } from "@/components/Common";
import { openFile } from "@/utils/utils";
import { uploadPdfPaper } from "@/utils/api/paper";

const PdfPreviewContainer = styled("div")({
    width: "100%",
    height: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
});

export default function PdfUpload({ paperDetails }) {
    const [pdf, setPdf] = useState({
        numberOfQuestion: "",
        perQuestionMarks: [],
        paperPdf: "",
        solutionPdf: "",
        solutionVideo: "",
    });
    const [loader, setLoader] = useState({ show: false });

    const [questionMarksList, setQuestionMarksList] = useState([]);
    const [file, setFile] = useState(null);

    const createList = () => {
        const newArray = [];

        for (let index = 1; index <= Number(pdf.numberOfQuestion); index++) {
            newArray.push({ id: index, marks: "" });
        }

        setQuestionMarksList(newArray);
    };

    const onClickSumbit = async () => {
        const pdfConfig = {
            ...pdf,
            perQuestionMarks: questionMarksList.map((el) => Number(el.marks)),
        };

        const paper = {
            board_id: paperDetails.board.boardId,
            class_id: paperDetails.class.classId,
            batch_id: paperDetails.batch.batchId,
            subject_id: paperDetails.subject.subjectId,
            course_id: paperDetails.course.courseId,
            paper_name: paperDetails.config.name,
            start_time: paperDetails.config.startTime,
            end_time: paperDetails.config.endTime,
            submission_time: Number(paperDetails.config.submissionTime),
            paper_total_marks: Number(paperDetails.config.totalMarks),
            paper_rejoin: Number(paperDetails.config.paperRejoin),
            paper_type: paperDetails.config.paperType,
            question_type: paperDetails.config.questionType,
            exam_type: paperDetails.config.examType,
            student_id: paperDetails.config.studentId,
            teacher_id: paperDetails.config.teacherId,
            test_type: paperDetails.config.testType,
            pdf: {
                number_of_question: pdfConfig.numberOfQuestion,
                per_question_marks: pdfConfig.perQuestionMarks,
                paper_pdf: "",
                solution_pdf: pdfConfig.solutionPdf,
                solution_video: pdfConfig.solutionVideo,
            },
        };

        try {
            console.log("here");
            setLoader({ show: true });
            const done = await uploadPdfPaper({ paper, file });
            setLoader({ show: false });
            console.log("done");
            console.log(done);
        } catch (error) {
            console.error(error);
        }
    };

    const onClickUpload = async () => {
        const blob = await openFile();

        setFile(blob);
    };

    return (
        <Grid container>
            <Grid item xs={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="h5">Enter Question Number</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    label="Question Number"
                                    value={pdf.numberOfQuestion}
                                    onChange={(e) => {
                                        setPdf((prevState) => ({
                                            ...prevState,
                                            numberOfQuestion: e.target.value,
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        createList();
                                    }}
                                >
                                    Add
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button fullWidth variant="contained" color="primary" onClick={() => onClickSumbit()}>
                                    Submit
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            placeholder="Enter pdf solution link"
                                            value={pdf.solutionPdf}
                                            onChange={(e) => {
                                                setPdf((prevState) => ({ ...prevState, solutionPdf: e.target.value }));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            placeholder="Enter video solution link"
                                            value={pdf.solutionVideo}
                                            onChange={(e) => {
                                                setPdf((prevState) => ({
                                                    ...prevState,
                                                    solutionVideo: e.target.value,
                                                }));
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                    Question Marks List
                                </Typography>
                            </Grid>
                            {questionMarksList.length !== 0 &&
                                questionMarksList.map(({ id, marks }, i) => (
                                    <Grid item xs={2} key={i}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            size="small"
                                            variant="outlined"
                                            placeholder="Question Marks"
                                            label={`Question ${id}`}
                                            value={marks}
                                            onChange={(e) => {
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
                                            }}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <PdfPreviewContainer>
                    {!file ? (
                        <>
                            <Typography variant="h6">Privew</Typography>
                            <Button variant="contained" color="primary" onClick={() => onClickUpload()}>
                                Upload
                            </Button>
                        </>
                    ) : (
                        <Typography variant="h6">{file.name}</Typography>
                    )}
                </PdfPreviewContainer>
            </Grid>
            <Dialog open={loader.show}>
                <DialogContent>
                    <Progress />
                    <DialogContentText>Please wait it will take some time</DialogContentText>
                </DialogContent>
            </Dialog>
        </Grid>
    );
}
