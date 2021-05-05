import { useQuery } from "react-query";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import { useStepForm } from "./StepFormContext";
import { useStylesForStepForm } from "./StepForm";
import { getAllBoards } from "@/utils/api/board";

import { Progress, TextContainer } from "../Common";

export default function BoardInput() {
    const classes = useStylesForStepForm();
    const [state, dispatch] = useStepForm();
    const { data: response, isLoading } = useQuery("getAllBoards", getAllBoards);

    if (isLoading) {
        return <Progress />;
    } else {
        if (response.status) {
            return (
                <div className={classes.form}>
                    <FormControl className={classes.formControl} variant="outlined">
                        <InputLabel id="select-board">Select Board</InputLabel>
                        <Select
                            labelId="select-board"
                            label="select-board"
                            value={state.board.boardId}
                            onChange={(e) => {
                                dispatch({
                                    type: "board",
                                    value: { boardId: e.target.value, isBoardSelected: true },
                                });
                            }}
                        >
                            {response.data.map((value) => {
                                return (
                                    <MenuItem key={value.board_id} value={value.board_id}>
                                        {value.board_name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </div>
            );
        } else {
            return (
                <TextContainer>
                    <Typography variant="h4" align="center">
                        Unable to find boards
                    </Typography>
                </TextContainer>
            );
        }
    }
}
