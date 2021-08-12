import { useQuery } from "react-query";
import { Typography } from "@material-ui/core";

import List from "./List";
import { Progress } from "./Common";
import { getFixedFormatQuestions } from "@/utils/api/cip-backend/questions";

/**
 * @callback getList
 * @param {string[]} question id list
 * @returns null
 */

/**
 * @param {Object} props Question list component props
 * @param {Object.<string, string>} props.filter filter name for questions
 * @param {getList} props.getList callback for getting question id list
 */
export default function QuestionList({ filter, getList }) {
    const { data, isLoading, isError } = useQuery(
        ["fetch questions", filter],
        () => {
            return getFixedFormatQuestions({
                board: filter.board,
                class_name: filter.klass,
                subject: filter.subject,
                chapter: filter.chapter,
                total_marks: filter.marks,
            });
        },
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
        return (
            <List
                data={data}
                filter={filter}
                getList={(list) => {
                    getList(list.map((question) => question._id));
                }}
            />
        );
    } else {
        return (
            <Typography variant="h4" align="center">
                No data
            </Typography>
        );
    }
}
