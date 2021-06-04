import {
    Paper,
    Table,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    TableContainer,
    Typography,
    Toolbar,
    Button,
    Tooltip,
    Zoom,
} from "@material-ui/core";

import { styled } from "@material-ui/core/styles";

import { TableWrapper } from "@/components/Common";

const ToolbarHeading = styled(Typography)({
    flex: "1 1 100%",
});

function TableToolBar({ children, onClick, ...rest }) {
    return (
        <Toolbar>
            <ToolbarHeading variant="h6" id="tableTitle">
                {children}
            </ToolbarHeading>
            <Tooltip title={`Please use example csv file to upload`} TransitionComponent={Zoom}>
                <span>
                    <Button color="primary" variant="contained" onClick={onClick} {...rest}>
                        Upload
                    </Button>
                </span>
            </Tooltip>
        </Toolbar>
    );
}

const TextContainer = styled("div")(({ theme }) => ({
    width: "100%",
    height: 500,
    marginTop: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

export default function PaperTable({ list, title = "Papers", onClickUpload, disableUploadBtn }) {
    return (
        <TableWrapper>
            <TableContainer component={Paper}>
                <TableToolBar
                    disabled={disableUploadBtn}
                    onClick={() => {
                        onClickUpload();
                    }}
                >
                    {title}
                </TableToolBar>
                {list.length === 0 ? (
                    <TextContainer>
                        <Typography variant="h4" align="center">
                            Upload Credentials
                        </Typography>
                    </TextContainer>
                ) : (
                    <Table aria-label="student credentials list table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Sr. No.</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Father Name</TableCell>
                                <TableCell align="center">Mother Name</TableCell>
                                <TableCell align="center">Mobile</TableCell>
                                <TableCell align="center">Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="center" component="th" scope="row">
                                        {++i}
                                    </TableCell>
                                    <TableCell align="center">{row.Name}</TableCell>
                                    <TableCell align="center">{row.Father_Name}</TableCell>
                                    <TableCell align="center">{row.Mother_Name}</TableCell>
                                    <TableCell align="center">{row.Mobile}</TableCell>
                                    <TableCell align="center">{row.Email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </TableWrapper>
    );
}
