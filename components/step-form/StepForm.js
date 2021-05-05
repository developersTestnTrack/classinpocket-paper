import { useState } from "react";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import { makeStyles, styled } from "@material-ui/core/styles";

import FormProvider, { useStepForm } from "./StepFormContext";
import BoardInput from "./BoardInput";
import ClassInput from "./ClassInput";
import BatchInput from "./BatchInput";
import SubjectInput from "./SubjectInput";
import CourseInput from "./CourseInput";
import PaperDetail from "./PaperDetail";

const Btn = styled("div")(({ theme }) => ({
    display: "inline",
    marginRight: theme.spacing(2),
}));

export const useStylesForStepForm = makeStyles((theme) => ({
    form: {
        display: "flex",
        justifyContent: "center",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: "100%",
    },

    formControl: {
        width: "100%",
    },
    dateTime: {
        display: "flex",
        justifyContent: "space-between",
    },
}));

function RenderStepContent({ activeStep, setActiveStep, onFinish, steps }) {
    const [state] = useStepForm();

    const handleNext = () => {
        if (activeStep === steps.length - 1 && state.config.questionType === "Individual") {
            onFinish(state);
        } else if (activeStep === steps.length - 1 && state.config.questionType === "Pdf") {
            onFinish(state);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    switch (activeStep) {
        case 0: {
            return (
                <>
                    <BoardInput />

                    <Btn>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                    </Btn>

                    <Btn>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!state.board.isBoardSelected}
                        >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Btn>
                </>
            );
        }
        case 1: {
            return (
                <>
                    <ClassInput />
                    <Btn>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                    </Btn>

                    <Btn>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!state.class.isClassSelected}
                        >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Btn>
                </>
            );
        }
        case 2: {
            return (
                <>
                    <BatchInput />
                    <Btn>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                    </Btn>

                    <Btn>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!state.batch.isBatchSelected}
                        >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Btn>
                </>
            );
        }
        case 3: {
            return (
                <>
                    <SubjectInput />
                    <Btn>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                    </Btn>

                    <Btn>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!state.subject.isSubjectSelected}
                        >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Btn>
                </>
            );
        }
        case 4: {
            return (
                <>
                    <CourseInput />
                    <Btn>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                    </Btn>

                    <Btn>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!state.course.isCourseSelected}
                        >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Btn>
                </>
            );
        }
        case 5: {
            return (
                <>
                    <PaperDetail />
                    <Btn>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                    </Btn>

                    <Btn>
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </Btn>
                </>
            );
        }
        default: {
            return "Unknown step";
        }
    }
}

export default function StepForm({ onFinish }) {
    const steps = ["Board", "Class", "Batch", "Subject", "Course", "Paper Details"];
    const [activeStep, setActiveStep] = useState(0);

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <FormProvider>
            <Container maxWidth="md">
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div style={{ paddingRight: "24px", paddingLeft: "24px" }}>
                    {activeStep === steps.length ? (
                        <>
                            <Typography>All steps completed</Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </>
                    ) : (
                        <RenderStepContent
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            onFinish={onFinish}
                            steps={steps}
                        />
                    )}
                </div>
            </Container>
        </FormProvider>
    );
}
