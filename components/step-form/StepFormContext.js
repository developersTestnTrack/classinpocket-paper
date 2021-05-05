import { createContext, useReducer, useContext } from "react";
import formatISO from "date-fns/formatISO";

const StepFormContext = createContext();
const StepFormDispatchContext = createContext();

const StepFormProvider = StepFormContext.Provider;
const StepFormDispatchProvider = StepFormDispatchContext.Provider;

const initialFormState = {
    board: { boardId: "", isBoardSelected: false },
    class: { classId: "", isClassSelected: false },
    batch: { batchId: "", isBatchSelected: false },
    subject: { subjectId: [], isSubjectSelected: false },
    course: { courseId: [], isCourseSelected: false },
    config: {
        name: "",
        startTime: formatISO(new Date()),
        endTime: formatISO(new Date()),
        submissionTime: "",
        questionType: "",
        paperType: "",
        paperRejoin: "",
        examType: "",
        totalMarks: "",
        teacherId: "",
        studentId: [],
        testType: "",
    },
};

function formReducer(state, action) {
    switch (action.type) {
        case "board": {
            return { ...state, board: action.value };
        }
        case "class": {
            return { ...state, class: action.value };
        }
        case "batch": {
            return { ...state, batch: action.value };
        }
        case "subject": {
            return { ...state, subject: action.value };
        }
        case "course": {
            return { ...state, course: action.value };
        }
        case "config": {
            return { ...state, config: { ...state.config, ...action.value } };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

export default function FormProvider({ children }) {
    const [state, dispatch] = useReducer(formReducer, initialFormState);
    return (
        <StepFormProvider value={state}>
            <StepFormDispatchProvider value={dispatch}>{children}</StepFormDispatchProvider>
        </StepFormProvider>
    );
}

export function useFormState() {
    const context = useContext(StepFormContext);

    if (context === undefined) {
        throw new Error("useFormState must be used within a StepFormProvider");
    }

    return context;
}

export function useFormDispatch() {
    const context = useContext(StepFormDispatchContext);

    if (context === undefined) {
        throw new Error("useFormDispatch must be used within a StepFormDispatchProvider");
    }

    return context;
}

export function useStepForm() {
    return [useFormState(), useFormDispatch()];
}
