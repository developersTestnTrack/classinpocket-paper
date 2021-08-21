import { useMutation } from "react-query";
import { useState } from "react";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import {
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    IconButton,
} from "@material-ui/core";
import { CloudDownload as CloudDownloadIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { useEditor } from "./editorUtil";
import { Progress } from "@/components/Common";

import { submitQuestions } from "@/utils/api/cip-backend/questions";
import { Close } from "@material-ui/icons";

const PaperPreview = dynamic(() => import("./PaperPreview"));

const useStyles = makeStyles((theme) => ({
    listBtnPreview: {
        backgroundColor: theme.palette.primary.light,
        borderRadius: "4px",
        color: "black",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function genrateQuestionList(list, paper) {
    console.log(paper);
    return list.map((question) => ({
        board: question.config.board,
        class_name: question.config.klass,
        subject: question.config.subject,
        chapter: question.config.chapter,
        topic: question.config.topic,
        question_text: question.text,
        question_cat: question.config.question_cat,
        question_time: Number(question.config.time),
        question_marks: Number(question.config.marks),
        difficulty_level: question.config.difficulty_level,
        pdf_solution: question.config.pdf,
        video_solution: question.config.video,
        question_options: question.options.map((option) => ({ text: option.text, value: option.status })),
        hasOption: paper.hasOption,
        created_date: Date.now(),
    }));
}

export default function SubmitPanel() {
    const classes = useStyles();
    const [state] = useEditor();
    const [dialogState, setDialogState] = useState({ open: false, msg: "", status: "idle" });
    const [previewPaper, setPreviewPaper] = useState(false);

    const { list, paper } = state;

    const { mutate } = useMutation("submit", submitQuestions, {
        onMutate: () => {
            setDialogState({ open: true, msg: "Please wait it will take some time" });
        },
        onSuccess: () => {
            console.log("successfully submitted");
            location.reload();
            setDialogState({ open: true, msg: "successfully submitted", status: "idle" });
        },
        onError: () => {
            console.log("something went wrong !!!");
            setDialogState({ open: true, msg: "something went wrong please download file.", status: "error" });
        },
    });

    const downloadQuestions = () => {
        //generate json file
        const questionPayload = {
            number_of_questions: list.length,
            list: genrateQuestionList(list, paper),
            created_date: Date.now(),
        };
        const blobJson = new Blob([JSON.stringify(questionPayload, undefined, 2)], {
            type: "application/json",
        });
        saveAs(blobJson, `${format(Date.now(), "dd/MM/yyyy-HH:mm:ss")}.json`);
    };

    const onClickSubmit = () => {
        const questionPayload = {
            number_of_questions: list.length,
            list: genrateQuestionList(list, paper),
            created_date: Date.now(),
        };

        console.log(questionPayload);
        mutate(questionPayload);
    };

    const onClickClose = () => {
        setPreviewPaper(false);
    };

    return (
        <>
            <Button
                fullWidth
                size="small"
                color="primary"
                variant="contained"
                onClick={() => {
                    onClickSubmit();
                }}
            >
                Submit
            </Button>

            {/* paper preview panel */}
            <Dialog fullScreen open={previewPaper}>
                <PaperPreview onClose={onClickClose} paper={paper} list={list} submit={onClickSubmit} />
            </Dialog>

            {/* paper submit confirmation */}
            <Dialog
                open={dialogState.open}
                onClose={() => setDialogState((prevState) => ({ ...prevState, open: false }))}
            >
                {dialogState.status === "error" && (
                    <DialogTitle disableTypography>
                        <Typography variant="h6">Error</Typography>
                        <IconButton
                            className={classes.closeButton}
                            onClick={() => {
                                setDialogState((prevState) => ({ ...prevState, open: false }));
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                )}
                <DialogContent>
                    {dialogState.status !== "error" && <Progress />}
                    {dialogState.status === "error" && (
                        <div style={{ width: "100%", paddingLeft: "32%", marginBottom: "1rem" }}>
                            <Button
                                color="primary"
                                variant="contained"
                                startIcon={<CloudDownloadIcon />}
                                onClick={() => {
                                    downloadQuestions();
                                }}
                            >
                                Download
                            </Button>
                        </div>
                    )}
                    <DialogContentText>{dialogState.msg}</DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}
