import { styled, makeStyles } from "@material-ui/core/styles";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { RefreshBtn } from "@/components/Buttons";

export const TextContainer = styled("div")({
    width: "100%",
    height: 100,
});

export const useTableToolBarStyles = makeStyles({
    title: {
        flex: "1 1 100%",
    },
});

const ProgressContainer = styled("div")({
    width: "100%",
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

export function Progress() {
    return (
        <ProgressContainer>
            <CircularProgress />
        </ProgressContainer>
    );
}

export function TableToolBar({ children, onClickRefresh }) {
    const classes = useTableToolBarStyles();
    return (
        <Toolbar>
            <Typography variant="h6" id="tableTitle" component="div" className={classes.title}>
                {children}
            </Typography>
            <RefreshBtn onClick={onClickRefresh} />
        </Toolbar>
    );
}

export const TableWrapper = styled("div")(({ theme }) => ({ paddingTop: theme.spacing(1) }));
