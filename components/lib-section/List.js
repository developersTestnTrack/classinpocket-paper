import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, CssBaseline, Menu, MenuItem, IconButton, Button, Dialog } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";

import Editor from "@/components/exam-paper-generate/editor/Editor";
import { getFreshQuestion } from "@/utils/api/cip-backend/questions";

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
                        popupState.toggle();
                    }}
                >
                    Edit
                </MenuItem>
                {/* <MenuItem
                    dense
                    onClick={() => {
                        props.onClickDelete();
                        popupState.toggle();
                    }}
                >
                    Delete
                </MenuItem> */}
                <MenuItem
                    dense
                    onClick={() => {
                        popupState.toggle();
                        props.refetch();
                    }}
                >
                    Refetch
                </MenuItem>
            </Menu>
        </>
    );
}

export default function List({ data, filter }) {
    const classes = useStyles();
    const router = useRouter();
    const [list, setList] = useState(data);
    const [dailog, setDailog] = useState(false);
    const [editor, setEditorState] = useState({ text: "", index: 0 });
    const [questions, setQuestions] = useState(null);
    const { mutate, isLoading } = useMutation((payload) => getFreshQuestion(payload));

    const paddingOption = (num) => {
        switch (num) {
            case 0:
                return "a";

            case 1:
                return "b";

            case 2:
                return "c";

            case 3:
                return "d";
        }
    };

    const editItem = (index, question) => {
        const tempList = [...list];
        const [deleteItem] = tempList.splice(index, 1);
        tempList.splice(index, 0, deleteItem);
        setList(tempList);
        setEditorState({ text: question.question_text, index: index });
        setDailog(true);
    };

    const deleteItem = (index) => {
        const tempList = [...list];
        tempList.splice(index, 1);
        setList(tempList);
    };

    const refetchItem = (index, q) => {
        console.log("question: ", q);
        setQuestions(index);
        mutate(
            {
                board: filter.board,
                class: filter.klass,
                subject: filter.subject,
                chapter: filter.chapter,
                question_ids: list.map((q) => q._id),
                question_marks: q.question_marks,
            },
            {
                onSuccess: (data) => {
                    console.log("question fetched: ", data);
                    const tempList = [...list];
                    tempList.splice(index, 1);
                    tempList.splice(index, 0, data[0]);
                    setList(tempList);
                },
                onSettled: () => {
                    setQuestions(null);
                },
            }
        );
    };

    return (
        <CssBaseline>
            <Button
                style={{ position: "absolute", top: 18, right: 100 }}
                color="primary"
                variant="text"
                onClick={() => {
                    console.log(filter);
                    router.push({
                        pathname: "/library/print",
                        query: {
                            ids: list.map((q) => q._id),
                            details: JSON.stringify(filter),
                        },
                    });
                }}
            >
                Go to print page
            </Button>

            <Grid container>
                {list.map((question, i) => {
                    return (
                        <Grid className={classes.item} item xs={12} key={question._id}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography component="p" className={classes.p}>
                                        Q: {i + 1}
                                    </Typography>
                                    <MoreBtn
                                        className={classes.moreIcon}
                                        onClickEdit={() => editItem(i, question)}
                                        onClickDelete={() => deleteItem(i)}
                                        refetch={() => refetchItem(i, question)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {isLoading && questions === i ? (
                                        <>
                                            <Skeleton variant="text" width="100%" />
                                            <br />
                                            <Skeleton variant="text" width="100%" />
                                            <br />
                                            <Skeleton variant="rect" width="100%" height={200} />
                                        </>
                                    ) : (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: question.question_text }}></div>
                                            {question.hasOption &&
                                                question.question_options.map((option, i) => {
                                                    return (
                                                        <div key={option._id} style={{ display: "flex" }}>
                                                            <p style={{ marginRight: "10px" }}>({paddingOption(i)})</p>
                                                            <div
                                                                dangerouslySetInnerHTML={{ __html: option.text }}
                                                            ></div>
                                                        </div>
                                                    );
                                                })}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
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
