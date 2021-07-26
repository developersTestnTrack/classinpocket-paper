import { useMutation } from "react-query";
import { useState, Fragment } from "react";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import {
    List,
    ListItem,
    ListItemText,
    Paper,
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

function genrateQuestionList(list) {
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
        paper_cat: question.config.paper_cat,
        difficulty_level: question.config.difficulty_level,
        pdf_solution: question.config.pdf,
        video_solution: question.config.video,
        question_options: question.options.map((option) => ({ text: option.text, value: option.status })),
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
        onSuccess: (e) => {
            console.log(e);
            console.log("successfully submitted");
            setDialogState({ open: true, msg: "successfully submitted", status: "idle" });
        },
        onError: (e) => {
            console.log(e);
            console.log("something went wrong !!!");
            setDialogState({ open: true, msg: "something went wrong please download file.", status: "error" });
        },
    });

    const downloadQuestions = () => {
        //generate json file
        const blobJson = new Blob(
            [JSON.stringify({ number_of_questions: list.length, list: genrateQuestionList(list) }, undefined, 2)],
            {
                type: "application/json",
            }
        );
        saveAs(blobJson, `${format(Date.now(), "dd/MM/yyyy-HH:mm:ss")}.json`);
    };

    const onClickSubmit = () => {
        console.log(genrateQuestionList(list));
        setDialogState({ open: true, msg: "something went wrong please download file.", status: "error" });
        mutate({ number_of_questions: list.length, list: genrateQuestionList(list) });
    };

    const onClickClose = () => {
        setPreviewPaper(false);
    };

    return (
        <Fragment>
            <List component={Paper} disablePadding>
                <ListItem
                    button
                    className={classes.listBtnPreview}
                    onClick={() => {
                        onClickSubmit();
                    }}
                >
                    <ListItemText>
                        <Typography variant="h6" align="center">
                            Finish
                        </Typography>
                    </ListItemText>
                </ListItem>
            </List>

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
        </Fragment>
    );
}
