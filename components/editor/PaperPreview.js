import { Typography, Container, IconButton, Button } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import PaperPreviewPanel from "../PaperPreviewPanel";
import { generatePaper } from "@/utils/utils";

const useStyles = makeStyles((theme) => ({
    offset: { flexGrow: 1 },
    nav: {
        display: "flex",
        flexGrow: 1,
        padding: theme.spacing(1, 1),
    },
}));

export default function PaperPreview({ onClose, list, paper, submit }) {
    const classes = useStyles();
    const previewPaper = generatePaper({ paper, questions: list });
    console.log(generatePaper({ paper, questions: list }));

    return (
        <Container maxWidth="xl" style={{ backgroundColor: "#eceff1", minHeight: "100vh" }}>
            <div className={classes.nav}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" align="center" className={classes.offset}>
                    Paper Preview
                </Typography>
                <div>
                    <Button variant="contained" color="primary" size="large" onClick={() => submit()}>
                        Submit
                    </Button>
                </div>
            </div>
            <PaperPreviewPanel data={{ paper: previewPaper }} />
        </Container>
    );
}
