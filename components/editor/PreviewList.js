import { useState, Fragment } from "react";
import { Container as DndContainer, Draggable } from "react-smooth-dnd";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
}));

export default function PreviewList() {
    const classes = useStyles();
    const [state, dispatch] = useEditor();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    </ListSubheader>
                }
            >
                <DndContainer>
                    {list.map((q, i) => {
                        return (
                            <Draggable key={q.id}>
                                <ListItem button key={i}>
                                    <ListItemText primary={`Question ${i + 1}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton size="small" onClick={handleClick}>
                                            <MoreIcon />
                                        </IconButton>

                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    setDailogState({ open: true, question: q });
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <VisibilityIcon />
                                                </ListItemIcon>
                                                <ListItemText>View</ListItemText>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    dispatch({
                                                        type: "ENABLE_EDIT",
                                                        selectedQuestion: q,
                                                        index: i,
                                                    });
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <EditIcon />
                                                </ListItemIcon>
                                                <ListItemText>Edit</ListItemText>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    dispatch({ type: "DELETE_QUESTION", index: i });
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <DeleteIcon />
                                                </ListItemIcon>
                                                <ListItemText>Delete</ListItemText>
                                            </MenuItem>
                                        </Menu>
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
