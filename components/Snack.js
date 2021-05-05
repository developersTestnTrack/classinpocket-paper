import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const hideDuration = 3000;

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function Snack({ open, onClose, status, msg }) {
    const classes = useStyles();

    if (status === "idle") {
        return (
            <div className={classes.root}>
                <Snackbar open={open} autoHideDuration={hideDuration} onClose={onClose}>
                    <Alert onClose={onClose} severity="info">
                        {msg}
                    </Alert>
                </Snackbar>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className={classes.root}>
                <Snackbar open={open} autoHideDuration={hideDuration} onClose={onClose}>
                    <Alert onClose={onClose} severity="success">
                        {msg}
                    </Alert>
                </Snackbar>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className={classes.root}>
                <Snackbar open={open} autoHideDuration={hideDuration} onClose={onClose}>
                    <Alert onClose={onClose} severity="error">
                        {msg}
                    </Alert>
                </Snackbar>
            </div>
        );
    }

    return null;
}
