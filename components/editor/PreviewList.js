import { useState, Fragment } from "react";
import { Container as DndContainer, Draggable } from "react-smooth-dnd";
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
    dragHandle: {
        cursor: "move",
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

    const { list, paper } = state;
    return (
        <Fragment>
            <List
                className={classes.list}
                component={Paper}
                aria-labelledby="preview-list"
                subheader={
                    <ListSubheader component="div" id="preview-list">
                        <Typography variant="h5" align="center">
                            Preview List
                        </Typography>
                        <Typography variant="h6" align="center">
                            {list.length}/{paper.config.numberOfQuestions}
                        </Typography>
                    </ListSubheader>
                }
            >
                <DndContainer
                    dropPlaceholder
                    onDrop={(dropResult) => {
                        dispatch({
                            type: "UPDATE_LIST_ORDER",
                            value: { addedIndex: dropResult.addedIndex, removedIndex: dropResult.removedIndex },
                        });
                    }}
                >
                    {list.map((q, i) => {
                        return (
                            <Draggable key={q.id}>
                                <ListItem key={q.id} button>
                                    <ListItemText primary={`Question ${i + 1}`} />
                                    <ListItemSecondaryAction>
                                        <ListMoreBtn
                                            onClickView={() => {
                                                setDailogState({ open: true, question: q });
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
                            </Draggable>
                        );
                    })}
                </DndContainer>
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
        </Fragment>
    );
}
