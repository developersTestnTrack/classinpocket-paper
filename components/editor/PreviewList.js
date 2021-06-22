import { useState } from "react";

import clsx from "clsx";
import {
    ListItem,
    List,
    ListSubheader,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Paper,
    IconButton,
    Dialog,
    Grid,
    Container,
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
} from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import { useEditor } from "./editorUtil";

const useStyles = makeStyles((theme) => ({
    list: {
        height: "95vh",
        maxHeight: theme.spacing(115),
        overflowY: "auto",
    },
    header: {
        width: "100%",
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(12),
    },
    question: {
        width: "100%",
        border: "1px solid black",
        borderRadius: "10px",
        padding: theme.spacing(1),
        minHeight: theme.spacing(30),
        overflow: "auto",
    },
    options: {
        width: "100%",
        border: "1px solid black",
        borderRadius: "10px",
        padding: theme.spacing(1),
        minHeight: theme.spacing(20),
    },
    highlightOption: {
        width: "100%",
        border: "5px solid green",
        borderRadius: "10px",
        padding: theme.spacing(1),
        minHeight: theme.spacing(20),
    },
    highlightListItem: {
        color: "blue",
    },
}));

export default function PreviewList() {
    const classes = useStyles();
    const [state, dispatch] = useEditor();

    const [dailogState, setDailogState] = useState({ open: false, question: null });

    const { list, paper } = state;
    return (
        <>
            <List
                className={classes.list}
                component={Paper}
                aria-labelledby="preview-list"
                subheader={
                    <ListSubheader component="div" id="preview-list">
                        <Typography variant="h5" align="center">
                            Preview List
                        </Typography>
                    </ListSubheader>
                }
            >
                {list.length === 0 ? (
                    <ListItem>
                        <ListItemText>
                            <Typography variant="h6" align="center">
                                Start Adding
                            </Typography>
                            <Typography variant="h6" align="center">
                                Question
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ) : (
                    list.map((q, i) => {
                        return (
                            <ListItem key={i}>
                                <ListItemText primary={`Question ${i + 1}`} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setDailogState({ open: true, question: q });
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            dispatch({ type: "ENABLE_EDIT", selectedQuestion: q, index: i });
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            dispatch({ type: "DELETE_QUESTION", index: i });
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })
                )}
            </List>
            <Dialog fullScreen open={dailogState.open}>
                <div className={classes.header}>
                    <IconButton
                        onClick={() => {
                            setDailogState({ open: false, question: null });
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div
                                className={classes.question}
                                dangerouslySetInnerHTML={{ __html: dailogState.question?.text }}
                            />
                        </Grid>
                        {paper.config.paperType === "Examania" ? (
                            <div></div>
                        ) : (
                            dailogState.question?.options.map((option, i) => {
                                return (
                                    <Grid item xs={6} key={i}>
                                        <div
                                            className={clsx(classes.options, {
                                                [classes.highlightOption]: option.status,
                                            })}
                                            dangerouslySetInnerHTML={{ __html: option.text }}
                                        />
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>
                </Container>
            </Dialog>
        </>
    );
}
