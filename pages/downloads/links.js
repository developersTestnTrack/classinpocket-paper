import { useQuery } from "react-query";
import { format } from "date-fns";
import { Typography, Container, Grid, Paper, Divider, Button } from "@material-ui/core";
import { GetApp as GetAppIcon } from "@material-ui/icons";

import { firebaseStorage } from "@/utils/api/firebase-api/fire";
import { Progress } from "@/components/Common";

async function getObjList() {
    const storageRef = firebaseStorage.ref();
    const listRef = await storageRef.child("apk").listAll();
    const [item] = listRef.items;

    const list = await Promise.all(
        listRef.items.map(async (obj) => {
            const url = await obj.getDownloadURL();
            const metaData = await obj.getMetadata();

            return {
                url: url,
                appName: metaData.name,
                size: Number.parseFloat(metaData.size / (1024 * 1024)).toFixed(2),
                timeCreated: metaData.timeCreated,
            };
        })
    );

    const url = await item.getDownloadURL();
    const metaData = await item.getMetadata();

    return {
        url: url,
        appName: metaData.name,
        size: Number.parseFloat(metaData.size / (1024 * 1024)).toFixed(2),
        timeCreated: metaData.timeCreated,
        list,
    };
}

export default function Links() {
    const { data, isLoading } = useQuery("donwload-app-list", getObjList);

    if (isLoading) {
        return <Progress />;
    }

    console.log(data);

    return (
        <Container maxWidth="xs">
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
