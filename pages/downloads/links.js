import { useQuery } from "react-query";
import { format } from "date-fns";
import {
    Typography,
    Container,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Paper,
} from "@material-ui/core";

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
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Apk Name</TableCell>
                                    <TableCell size="small" align="right">
                                        Size
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        Upload Date
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        Link
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {data.appName}
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography noWrap>{data.size} MB</Typography>
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        {format(new Date(data.timeCreated), "dd/MM/yyyy hh:mm aaa")}
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography component="a" href={data.url} download>
                                            Download
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
}
