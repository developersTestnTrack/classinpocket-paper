import { useQuery } from "react-query";
import { Typography } from "@material-ui/core";

import List from "./List";
import { Progress } from "../Common";
import { getFixedFormatQuestions } from "@/utils/api/cip-backend/questions";

/**
 * @param {Object} props Question list component props
 * @param {Object.<string, unknown>} props.filter filter name for questions
 */
export default function QuestionList({ filter }) {
    const { data, isLoading, isError } = useQuery(
        ["fetch questions", filter],
        () =>
            getFixedFormatQuestions({
                board: filter.board,
                class_name: filter.klass,
                subject: filter.subject,
                chapter: filter.chapter,
                total_marks: filter.marks,
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    if (isLoading) {
        return <Progress />;
    }

    if (isError) {
        return (
            <Typography variant="h4" align="center">
                Error
            </Typography>
        );
    }

    if (data.length) {
        return <List filter={filter} data={data} />;
    } else {
        return (
            <Typography variant="h4" align="center">
                No data
            </Typography>
        );
    }
}
