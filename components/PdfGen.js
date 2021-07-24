import { useQuery } from "react-query";
import { Container, Typography, Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { getAllQuestions } from "@/utils/api/cip-backend/questions";

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
}));

export default function Pdf() {
    const classes = useStyles();
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

    return (
        <CssBaseline>
            <Button
                onClick={() => {
                    window.print();
                }}
            >
                print
            </Button>
            <Container id="print" maxWidth="md" className={classes.container}>
                <Grid container spacing={0}>
                    {result.data.map((question, i) => {
                        return (
                            <Grid item xs={12} key={question._id}>
                                <Grid container spacing={0}>
                                    <Grid item xs={1}>
                                        <Typography component="p" className={classes.p}>
                                            Q: {++i}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <div dangerouslySetInnerHTML={{ __html: question.question_text }}></div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </CssBaseline>
    );
}
