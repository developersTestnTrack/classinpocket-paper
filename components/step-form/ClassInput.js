import { useQuery } from "react-query";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import { useStepForm } from "./StepFormContext";
import { useStylesForStepForm } from "./StepForm";
import { getClassByBoardId } from "@/utils/api/class";

import { Progress, TextContainer } from "../Common";

export default function ClassInput() {
    const classes = useStylesForStepForm();
    const [state, dispatch] = useStepForm();

    const { data: response, isLoading } = useQuery(["getClassById", state.board.boardId], () => {
        return getClassByBoardId({ boardId: state.board.boardId });
    });

    if (isLoading) {
        return <Progress />;
    } else {
        if (response.status) {
            return (
                <div className={classes.form}>
                    <FormControl className={classes.formControl} variant="outlined">
                        <InputLabel id="select-class">Select Class</InputLabel>
                        <Select
                            labelId="select-class"
                            label="select-class"
                            value={state.class.classId}
                            onChange={(e) => {
                                dispatch({
                                    type: "class",
                                    value: { classId: e.target.value, isClassSelected: true },
                                });
                            }}
                        >
                            {response.data.map((value) => {
                                return (
                                    <MenuItem key={value.class_id} value={value.class_id}>
                                        {value.class_name}
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
                        There are no classes for this board
                    </Typography>
                    ;
                </TextContainer>
            );
        }
    }
}
