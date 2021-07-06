import { useMutation } from "react-query";
import { useState, Fragment } from "react";
import dynamic from "next/dynamic";

import {
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useEditor } from "./editorUtil";
import { Progress } from "@/components/Common";

import { submitQuestions } from "@/utils/api/cip-backend/questions";

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
            setDialogState({ open: true, msg: "successfully submitted" });
            window.location.reload();
        },
        onError: (e) => {
            console.log(e);
            console.log("something went wrong !!!");
            setDialogState({ open: true, msg: "something went wrong !!!" });
        },
    });

    const onClickSubmit = () => {
        console.log(genrateQuestionList(list));
        mutate({ number_of_questions: list.length, list: genrateQuestionList(list) });
        // setDialogState(() => ({ open: true, msg: errors[0], status: "error" }));
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
                        // setPreviewPaper(true)
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
                <DialogContent>
                    {dialogState.status !== "error" && <Progress />}
                    <DialogContentText>{dialogState.msg}</DialogContentText>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}
