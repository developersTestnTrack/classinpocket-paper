import { useQuery } from "react-query";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import { useStepForm } from "./StepFormContext";
import { useStylesForStepForm } from "./StepForm";
import { getCourseByIdArray } from "@/utils/api/course";

import { Progress, TextContainer } from "../Common";

export default function CourseInput() {
    const classes = useStylesForStepForm();
    const [state, dispatch] = useStepForm();
    const { data: response, isLoading } = useQuery(
        ["getCourseByIdArray", state.board.boardId, state.class.classId, state.batch.batchId, state.subject.subjectId],
        () => {
            return getCourseByIdArray({
                boardId: state.board.boardId,
                classId: state.class.classId,
                batchId: state.batch.batchId,
                subjectId: state.subject.subjectId,
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
                        <InputLabel id="select-course">Select Course</InputLabel>
                        <Select
                            multiple
                            labelId="select-course"
                            label="select-course"
                            value={state.course.courseId}
                            onChange={(e) => {
                                dispatch({
                                    type: "course",
                                    value: { courseId: e.target.value, isCourseSelected: true },
                                });
                            }}
                        >
                            {response.data.map((value) => {
                                return (
                                    <MenuItem key={value.course_id} value={value.course_id}>
                                        {value.course_name}
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
                        There are no courses of this subjects
                    </Typography>
                </TextContainer>
            );
        }
    }
}
