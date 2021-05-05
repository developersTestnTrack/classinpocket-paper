import { styled } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import DeleteIcon from "@material-ui/icons/Delete";
import ViewIcon from "@material-ui/icons/Visibility";
import RefreshIcon from "@material-ui/icons/Refresh";
import LoopIcon from "@material-ui/icons/Loop";

const RedDeleteIcon = styled(DeleteIcon)({
    color: "red",
});

const EyeViewIcon = styled(ViewIcon)({
    color: "green",
});

const RedBtn = styled(Button)({
    color: "red",
});

const YellowBtn = styled(Button)({
    color: "yellow",
});

const GreenBtn = styled(Button)({
    color: "green",
});

export function StatusBtn({ status, children, ...rest }) {
    if (status === "Pending") {
        return (
            <YellowBtn startIcon={<LoopIcon />} {...rest}>
                {children}
            </YellowBtn>
        );
    }

    if (status === "Rejected") {
        return (
            <RedBtn startIcon={<LoopIcon />} {...rest}>
                {children}
            </RedBtn>
        );
    }

    if (status === "Approved") {
        return (
            <GreenBtn startIcon={<LoopIcon />} {...rest}>
                {children}
            </GreenBtn>
        );
    }
}

export function DeleteBtn({ onClick, ...props }) {
    return (
        <IconButton onClick={onClick} {...props}>
            <RedDeleteIcon />
        </IconButton>
    );
}

export function ProfileViewBtn({ onClick, ...props }) {
    return (
        <IconButton onClick={onClick} {...props}>
            <EyeViewIcon />
        </IconButton>
    );
}

export function RefreshBtn({ onClick, ...props }) {
    return (
        <IconButton onClick={onClick} {...props}>
            <RefreshIcon />
        </IconButton>
    );
}
