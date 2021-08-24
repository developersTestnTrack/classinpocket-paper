import { useQuery } from "react-query";
import { format } from "date-fns";
import { Typography, Container, Grid, Paper, Divider, Button } from "@material-ui/core";
import { GetApp as GetAppIcon } from "@material-ui/icons";

import { firebaseStorage } from "@/utils/api/firebase-api/fire";
import { Progress } from "@/components/Common";

async function list() {
    const storageRef = firebaseStorage.ref();
    const listRef = await storageRef.child("apk").listAll();
    const [item] = listRef.items;

    const url = await item.getDownloadURL();
    const metaData = await item.getMetadata();

    console.log(metaData);

    return {
        url: url,
        appName: metaData.name,
        size: Number.parseFloat(metaData.size / (1024 * 1024)).toFixed(2),
        timeCreated: metaData.timeCreated,
    };
}

export default function Links() {
    const { data, isLoading } = useQuery("donwload app", list);

    if (isLoading) {
        return <Progress />;
    }

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid style={{ display: "flex", justifyContent: "center", width: "100%" }} item xs={12}>
                    <img src="/black_logo.png" alt="logo" />
                </Grid>
                <Grid item xs={12} style={{ padding: "16px" }}>
                    <Grid container component={Paper} style={{ padding: "16px" }} spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                Apk Name
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography>{data.appName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography variant="h6" align="center">
                                Size
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography>{data.size} MB</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography variant="h6" align="center">
                                Upload Date
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            {format(new Date(data.timeCreated), "dd/MM/yyyy hh:mm aaa")}
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} align="center" style={{ paddingTop: "16px" }}>
                            <div>
                                <Button
                                    startIcon={<GetAppIcon />}
                                    component="a"
                                    href={data.url}
                                    download
                                    style={{ textDecoration: "none" }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                >
                                    Download
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
