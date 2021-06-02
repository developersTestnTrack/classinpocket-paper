import { useState } from "react";
import format from "date-fns/format";

import {
    Paper,
    Table,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    TableContainer,
    TablePagination,
    Typography,
} from "@material-ui/core";

import { styled } from "@material-ui/core/styles";

import { DeleteBtn } from "@/components/Buttons";
import Snack from "@/components/Snack";

const TextContainer = styled("div")(({ theme }) => ({
    width: "100%",
    height: 500,
    marginTop: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

function getSubjectName(value) {
    if (typeof value === "string") {
        return value;
    }

    return "value.join()";
}

export default function PaperTable({ list }) {
    const [snack, setSnackState] = useState({ open: false, status: "idle", msg: "" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const onClickDelete = () => {};

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (list.length === 0) {
        return (
            <TextContainer>
                <Typography variant="h4" align="center">
                    NO PAPER AVAILABLE
                </Typography>
            </TextContainer>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="paper list table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Sr. No.</TableCell>
                            <TableCell align="center">Paper Name</TableCell>
                            <TableCell align="center">Time</TableCell>
                            <TableCell align="center">Paper Marks</TableCell>
                            <TableCell align="center">Teacher</TableCell>
                            <TableCell align="center">Subject</TableCell>
                            <TableCell align="center">Paper Type</TableCell>
                            <TableCell align="center">Question Type</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list
                            .sort((a, b) => b.start_time.toDate() - a.start_time.toDate())
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="center" component="th" scope="row">
                                        {++i}
                                    </TableCell>
                                    <TableCell align="center">{row.paper_name}</TableCell>
                                    <TableCell align="center">
                                        {format(row.start_time.toDate(), "do MMM yyy")}
                                    </TableCell>
                                    <TableCell align="center">{row.paper_total_marks || "No marks"}</TableCell>
                                    <TableCell align="center">{row.teacher_id?.name || "No name"}</TableCell>
                                    <TableCell align="center">{getSubjectName(row.subject)}</TableCell>
                                    <TableCell align="center">{row.paper_type}</TableCell>
                                    <TableCell align="center">{row.question_type}</TableCell>
                                    <TableCell align="center">
                                        <DeleteBtn onClick={() => onClickDelete(row._id)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        <TablePagination
                            rowsPerPageOptions={[5, 10]}
                            count={list.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            <Snack
                open={snack.open}
                status={snack.status}
                msg={snack.msg}
                onClose={() => {
                    setSnackState({ ...snack, open: false });
                }}
            />
        </>
    );
}
