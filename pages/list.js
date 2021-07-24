import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Grid, CssBaseline, Dialog, Menu, MenuItem, IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";

import { getAllQuestions } from "@/utils/api/cip-backend/questions";
const Editor = dynamic(() => import("@/components/editor/Editor"), { ssr: false });

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: "white",
    },
    questionContainer: {
        display: "flex",
        flexDirection: "column",
    },
    questionInnerContainer: {
        padding: 0,
        margin: 0,
    },
    p: {
        paddingTop: theme.spacing(1.5),
        width: theme.spacing(10),
    },
    item: {
        position: "relative",
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        border: "2px solid black",
        borderRadius: "3px",
    },
    moreIcon: {
        margin: theme.spacing(1),
        position: "absolute",
        top: 0,
        right: 0,
        cursor: "pointer",
    },
}));

function MoreBtn(props) {
    const popupState = usePopupState({ variant: "popover", popupId: "morebtn" });

    return (
        <>
            <IconButton className={props.className} size="small" {...bindTrigger(popupState)}>
                <MoreIcon />
            </IconButton>
            <Menu {...bindMenu(popupState)}>
                <MenuItem
                    dense
                    onClick={() => {
                        props.onClickEdit();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => {
                        props.onClickDelete();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
}

function Pdf({ data }) {
    const classes = useStyles();
    const [list, setList] = useState(data);
    const [dailog, setDailog] = useState(false);
    const [editor, setEditorState] = useState({ text: "", index: 0 });

    return (
        <CssBaseline>
            <Container id="print" maxWidth="md" className={classes.container}>
                <Grid container spacing={0}>
                    {list.map((question, i) => {
                        return (
                            <Grid className={classes.item} item xs={12} key={question._id}>
                                <Grid container spacing={0}>
                                    <Grid item xs={1}>
                                        <Typography component="p" className={classes.p}>
                                            Q: {i + 1}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <div dangerouslySetInnerHTML={{ __html: question.question_text }}></div>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <MoreBtn
                                            className={classes.moreIcon}
                                            onClickEdit={() => {
                                                setEditorState({ text: question.question_text, index: i });
                                                setDailog(true);
                                            }}
                                            onClickDelete={() => {
                                                const tempList = [...list];
                                                tempList.splice(i, 1);

                                                setList(tempList);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
            <Dialog
                fullWidth
                keepMounted={false}
                maxWidth="md"
                open={dailog}
                onClose={() => {
                    const newList = list.map((question, i) => {
                        if (i === editor.index) {
                            return {
                                ...question,
                                question_text: editor.text,
                            };
                        } else {
                            return question;
                        }
                    });

                    console.log(newList);
                    setList(newList);
                    setEditorState({ text: "", index: 0 });
                    setDailog(false);
                }}
            >
                <Editor
                    placeholder="text here"
                    setContents={editor.text}
                    onChange={(content) => {
                        setEditorState((prevState) => ({ ...prevState, text: content }));
                    }}
                />
            </Dialog>
        </CssBaseline>
    );
}

export default function ListPage() {
    const { data: result, isLoading } = useQuery("get all questions", getAllQuestions);

    if (isLoading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h5" align="center">
                    loading
                </Typography>
            </Container>
        );
    }

    return <Pdf data={result.data} />;
}
