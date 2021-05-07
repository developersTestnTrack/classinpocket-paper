import { useState } from "react";
import dynamic from "next/dynamic";
// import { useMutation } from "react-query";
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

// import { addNewPaper } from "@/utils/api/paper";
import { generatePaper } from "@/utils/utils";
import { addPaper } from "@/utils/api/firebase-api/mutation";

const PaperPreview = dynamic(() => import("./PaperPreview"));

const useStyles = makeStyles((theme) => ({
    listBtnPreview: {
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: "white",
            borderTopLeftRadius: "3px",
            borderTopRightRadius: "3px",
        },
    },
    listBtnSubmit: {
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: "white",
            borderBottomLeftRadius: "3px",
            borderBottomRightRadius: "3px",
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

    // const { mutate } = useMutation("submit", addNewPaper, {
    //     onMutate: () => {
    //         setDialogState({ open: true, msg: "Please wait it will take some time" });
    //     },
    //     onSuccess: (result) => {
    //         console.log("successfully submitted");
    //         if (result.status) {
    //             setDialogState({ open: true, msg: result.msg });
    //             // router.push("/paper/list/");
    //         } else {
    //             setDialogState({ open: true, msg: result.msg });
    //         }
    //     },
    //     onError: () => {
    //         console.log("something went wrong !!!");
    //         setDialogState({ open: true, msg: "something went wrong !!!" });
    //     },
    // });

    const onClickSubmit = () => {
        const genPaper = generatePaper({ paper, questions: list });

        console.log(genPaper);
        console.log(params[0]);

        addPaper({ school_id: params[0], paper: genPaper })
            .then((id) => {
                console.log(id);
            })
            .catch((err) => console.log(err));

        // if (genPaper.questions.length > 0) {
        //     console.log(genPaper);
        //     mutate(genPaper);
        // }
    };

    const onClickClose = () => {
        setPreviewPaper(false);
    };

    return (
        <>
            <List component={Paper} disablePadding>
                <ListItem button className={classes.listBtnPreview} onClick={() => setPreviewPaper(true)}>
                    <ListItemText>
                        <Typography variant="h6" align="center">
                            Preview
                        </Typography>
                    </ListItemText>
                </ListItem>
                <ListItem button className={classes.listBtnSubmit} onClick={onClickSubmit}>
                    <ListItemText>
                        <Typography variant="h6" align="center">
                            Submit
                        </Typography>
                    </ListItemText>
                </ListItem>
            </List>
            <Dialog fullScreen open={previewPaper}>
                <PaperPreview onClose={onClickClose} paper={paper} list={list} />
            </Dialog>
            <Dialog
                open={dialogState.open}
                onClose={() => setDialogState((prevState) => ({ ...prevState, open: false }))}
            >
                <DialogContent>
                    <Progress />
                    <DialogContentText>{dialogState.msg}</DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}
