import { useQuery } from "react-query";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import { useStepForm } from "./StepFormContext";
import { useStylesForStepForm } from "./StepForm";
import { getBatchById } from "@/utils/api/batch";

import { Progress, TextContainer } from "../Common";

export default function BatchInput() {
    const classes = useStylesForStepForm();
    const [state, dispatch] = useStepForm();

    const { data: response, isLoading } = useQuery(["getBatchById", state.board.boardId, state.class.classId], () => {
        return getBatchById({ boardId: state.board.boardId, classId: state.class.classId });
    });

    if (isLoading) {
        return <Progress />;
    } else {
        if (response.status) {
            return (
                <div className={classes.form}>
                    <FormControl className={classes.formControl} variant="outlined">
                        <InputLabel id="select-batch">Select Batch</InputLabel>
                        <Select
                            labelId="select-batch"
                            label="select-batch"
                            value={state.batch.batchId}
                            onChange={(e) => {
                                dispatch({
                                    type: "batch",
                                    value: { batchId: e.target.value, isBatchSelected: true },
                                });
                            }}
                        >
                            {response.data.map((value) => {
                                return (
                                    <MenuItem key={value.batch_id} value={value.batch_id}>
                                        {value.batch_name}
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
                        There are no batches for this class
                    </Typography>
                    ;
                </TextContainer>
            );
        }
    }
}
