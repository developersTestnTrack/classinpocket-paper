import { useState, Fragment } from "react";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";
import clsx from "clsx";
import {
    ListItem,
    List,
    ListSubheader,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Typography,
    Paper,
    IconButton,
    Dialog,
    Grid,
    Container,
    Menu,
    MenuItem,
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
    MoreVert as MoreIcon,
} from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import { useEditor } from "./editorUtil";

const useStyles = makeStyles((theme) => ({
    list: {
        height: "85vh",
        maxHeight: theme.spacing(115),
        overflowY: "auto",
    },
    closeIcon: {
        width: "100%",
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
    },
    question: {
        width: "100%",
        border: "1px solid black",
        borderRadius: "5px",
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
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
    dragHandle: {
        cursor: "move",
    },
    dailog: {
        borderRadius: 0,
    },
}));

function ListMoreBtn({ onClickView, onClickDelete, onClickEdit }) {
    const popupState = usePopupState({ variant: "popover", popupId: "listmore" });
    return (
        <Fragment>
            <IconButton size="small" {...bindTrigger(popupState)}>
                <MoreIcon />
            </IconButton>

            <Menu {...bindMenu(popupState)}>
                <MenuItem
                    dense
                    onClick={() => {
                        onClickView();
                    }}
                >
                    <ListItemIcon>
                        <VisibilityIcon />
                    </ListItemIcon>
                    <ListItemText>View</ListItemText>
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => {
                        onClickEdit();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem
                    dense
                    onClick={() => {
                        onClickDelete();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Fragment>
    );
}

export default function PreviewList() {
    const classes = useStyles();
    const [state, dispatch] = useEditor();
    const [dailogState, setDailogState] = useState({ open: false, question: null });

    const { list, edit, paper } = state;

    return (
        <Fragment>
            <List
                className={classes.list}
                component={Paper}
                aria-labelledby="preview-list"
                subheader={
                    <ListSubheader component="div" id="preview-list">
                        <Typography variant="h5" align="center">
                            Preview
                        </Typography>
                    </ListSubheader>
                }
            >
                {edit.isEditing ? (
                    <div
                        style={{
                            height: "90%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h4" align="center">
                            Save
                        </Typography>
                        <Typography variant="h4" align="center">
                            or
                        </Typography>
                        <Typography variant="h4" align="center">
                            Close
                        </Typography>
                    </div>
                ) : (
                    list.map((q, i) => {
                        return (
                            <ListItem key={q.id} button>
                                <ListItemText primary={`Question ${i + 1}`} />
                                <ListItemSecondaryAction>
                                    <ListMoreBtn
                                        onClickView={() => {
                                            setDailogState({ open: true, question: { ...q, index: i } });
                                        }}
                                        onClickEdit={() => {
                                            dispatch({
                                                type: "ENABLE_EDIT",
                                                selectedQuestion: q,
                                                index: i,
                                            });
                                        }}
                                        onClickDelete={() => {
                                            dispatch({ type: "DELETE_QUESTION", index: i });
                                        }}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })
                )}
            </List>
            <Dialog classes={{ paper: classes.dailog }} maxWidth="md" open={dailogState.open}>
                <div>
                    <IconButton
                        style={{ margin: "5px" }}
                        onClick={() => {
                            setDailogState({ open: false, question: null });
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <Container style={{ minHeight: "500px", padding: "0 50px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Question: {dailogState.question?.index + 1}</Typography>
                            <div
                                className={classes.question}
                                dangerouslySetInnerHTML={{ __html: dailogState.question?.text }}
                            />
                        </Grid>
                        {paper.hasOption &&
                            dailogState.question?.options.map((option, i) => {
                                return (
                                    <Grid item xs={12} key={i}>
                                        <Typography variant="h6">Option: {option.rank}</Typography>
                                        <div
                                            className={clsx(classes.options, {
                                                [classes.highlightOption]: option.status,
                                            })}
                                            dangerouslySetInnerHTML={{ __html: option.text }}
                                        />
                                    </Grid>
                                );
                            })}
                    </Grid>
                </Container>
            </Dialog>
        </Fragment>
    );
}
