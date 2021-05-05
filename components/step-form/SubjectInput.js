import { useQuery } from "react-query";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import { useStepForm } from "./StepFormContext";
import { useStylesForStepForm } from "./StepForm";
import { getSubjectById } from "@/utils/api/subject";

import { Progress, TextContainer } from "../Common";

export default function SubjectInput() {
    const classes = useStylesForStepForm();
    const [state, dispatch] = useStepForm();

    const { data: response, isLoading } = useQuery(
        ["getSubjectById", state.board.boardId, state.class.classId, state.batch.batchId],
        () => {
            return getSubjectById({
                boardId: state.board.boardId,
                classId: state.class.classId,
                batchId: state.batch.batchId,
            });
        }
    );

    if (isLoading) {
        return <Progress />;
    } else {
        if (response.status) {
            return (
                <div className={classes.form}>
                    <FormControl className={classes.formControl} variant="outlined">
                        <InputLabel id="select-subject">Select Subject</InputLabel>
                        <Select
                            multiple
                            labelId="select-subject"
                            label="select-subject"
                            value={state.subject.subjectId}
                            onChange={(e) => {
                                dispatch({
                                    type: "subject",
                                    value: { subjectId: e.target.value, isSubjectSelected: true },
                                });
                            }}
                        >
                            {response.data.map((value) => {
                                return (
                                    <MenuItem key={value.subject_id} value={value.subject_id}>
                                        {value.subject_name}
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
                        There are no subjects for this batch
                    </Typography>
                </TextContainer>
            );
        }
    }
}
