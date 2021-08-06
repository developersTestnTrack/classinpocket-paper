import { useQuery } from "react-query";
import { Typography } from "@material-ui/core";

import List from "./List";
import { Progress } from "./Common";
import { getFixedQuestions } from "@/utils/api/cip-backend/questions";

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
    const { data, isLoading, isError } = useQuery(["questions", filter], () => getFixedQuestions(filter), {
        onSuccess: (data) => {
            getList(data.map((question) => question._id));
        },
    });

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
