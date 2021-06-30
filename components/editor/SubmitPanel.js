import { useState, Fragment } from "react";
import dynamic from "next/dynamic";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

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

import { generatePaper } from "@/utils/utils";
import { addPaper } from "@/utils/api/firebase-api/mutation";

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

export default function SubmitPanel() {
    const router = useRouter();
    const { params } = router.query;

    const classes = useStyles();
    const [state] = useEditor();
    const [dialogState, setDialogState] = useState({ open: false, msg: "", status: "idle" });
    const [previewPaper, setPreviewPaper] = useState(false);

    const { list, paper } = state;

    const { mutate } = useMutation("submit", addPaper, {
        onMutate: () => {
            setDialogState({ open: true, msg: "Please wait it will take some time" });
        },
        onSuccess: () => {
            console.log("successfully submitted");
            setDialogState({ open: true, msg: "successfully submitted" });
            window.location.reload();
        },
        onError: () => {
            console.log("something went wrong !!!");
            setDialogState({ open: true, msg: "something went wrong !!!" });
        },
    });

    const onClickSubmit = () => {
        console.log(state);
        const errors = [];
        const genPaper = generatePaper({ paper, questions: list });
        const totalMarks = list.reduce((acc, curr) => acc + Number(curr.config.marks), 0);
        const totalTime = list.reduce((acc, curr) => acc + Number(curr.config.time), 0);

        if (totalMarks < Number(paper.config.totalMarks)) {
            errors.push("Total marks doesn't match");
        }

        if (totalTime < Number(paper.config.duration)) {
            errors.push("Total time doesn't match");
        }

        if (genPaper.questions.length < Number(paper.config.numberOfQuestions)) {
            errors.push(`Total number of question is less then ${paper.config.numberOfQuestions}`);
        }

        if (errors.length > 0) {
            setDialogState(() => ({ open: true, msg: errors[0], status: "error" }));
        } else {
            mutate({ school_id: params[0], paper: genPaper });
        }
    };

    const onClickClose = () => {
        setPreviewPaper(false);
    };

    return (
        <Fragment>
            <List component={Paper} disablePadding>
                <ListItem button className={classes.listBtnPreview} onClick={() => setPreviewPaper(true)}>
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
