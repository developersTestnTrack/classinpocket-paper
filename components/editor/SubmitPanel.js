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
    const [dialogState, setDialogState] = useState({ open: false, msg: "" });
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
        const genPaper = generatePaper({ paper, questions: list });

        if (genPaper.questions.length === state.paper.numberOfQuestions) {
            mutate({ school_id: params[0], paper: genPaper });
        } else {
            console.log("error");
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
                    <Progress />
                    <DialogContentText>{dialogState.msg}</DialogContentText>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}
