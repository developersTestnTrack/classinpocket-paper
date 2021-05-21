import { useEffect, useState } from "react";
import xlsxParser from "xlsx-parse-json";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/router";
import { Container, Grid, Button, Paper as MuiPaper, Typography } from "@material-ui/core";
import { styled, useTheme } from "@material-ui/core/styles";

import { openFile, genStudents } from "@/utils/utils";
import { getClassById } from "@/utils/api/firebase-api/query";
import { addStudents } from "@/utils/api/firebase-api/mutation";

import { Progress } from "@/components/Common";
import Page from "@/components/Page";
import StudentCredentialTable from "@/components/StudentCredentialTable";
import Snack from "@/components/Snack";

const Paper = styled(MuiPaper)(({ theme }) => ({ padding: theme.spacing(2), display: "flex" }));

function CredentialsExportPage({ router }) {
    const { params } = router.query;
    const theme = useTheme();
    const [file, setfile] = useState({ data: [], name: "", isSelect: false });
    const [snack, setSnackState] = useState({ open: false, msg: "", status: "idle" });

    const { data, isLoading } = useQuery(["get class", params[0], params[1]], () => {
        return getClassById({ school_id: params[0], class_id: params[1] });
    });

    const { mutate, isLoading: isMutateLoading } = useMutation("addStudents", addStudents, {
        onMutate: () => {
            setSnackState({ open: true, msg: "Please wait uploading file", status: "idle" });
        },
        onSuccess: () => {
            setSnackState({ open: true, msg: "Successfull uploaded file", status: "success" });
        },
        onError: () => {
            setSnackState({ open: true, msg: "Something went wrong please try again", status: "error" });
        },
        onSettled: () => {
            setfile({ data: [], name: "", isSelect: false });
        },
    });

    useEffect(() => {
        console.log(data);
        console.log(file);
    });

    if (isLoading) {
        return <Progress />;
    }

    return (
        <Page showSideBar={false}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item md={12} />
                    <Grid item md={12}>
                        <Paper>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    openFile().then((file) => {
                                        xlsxParser.onFileSelection(file).then((data) => {
                                            setfile({ data: data.Sheet1, name: file.name, isSelect: true });
                                        });
                                    });
                                }}
                            >
                                Select File
                            </Button>
                            <Button
                                style={{ marginLeft: theme.spacing(2) }}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    const anchorElemnet = document.createElement("a");
                                    anchorElemnet.setAttribute("download", "example_student_csv.csv");
                                    anchorElemnet.href = "/students.csv";
                                    anchorElemnet.click();
                                }}
                            >
                                Download Example file
                            </Button>
                            <div style={{ flex: 1 }}>
                                {file.isSelect ? (
                                    <Typography variant="h5" align="center">
                                        {file.name}
                                    </Typography>
                                ) : (
                                    <Typography variant="h5" align="center">
                                        Select file from your pc
                                    </Typography>
                                )}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md={12}>
                        <StudentCredentialTable
                            title="Student Credentials"
                            list={file.data}
                            disableUploadBtn={!file.isSelect || isMutateLoading}
                            onClickUpload={() => {
                                console.log(
                                    genStudents({
                                        student_credential_list: file.data,
                                        class_details: data,
                                        school_id: params[0],
                                    })
                                );

                                mutate({
                                    school_id: params[0],
                                    student_list: genStudents({
                                        student_credential_list: file.data,
                                        class_details: data,
                                        school_id: params[0],
                                    }),
                                });
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Snack
                open={snack.open}
                onClose={() => {
                    setSnackState((prevState) => ({ ...prevState, open: false }));
                }}
                status={snack.status}
                msg={snack.msg}
            />
        </Page>
    );
}

export default function ExportLoginPage() {
    const router = useRouter();
    const { params } = router.query;

    if (!params) {
        return <Progress />;
    }
    return <CredentialsExportPage router={router} />;
}
