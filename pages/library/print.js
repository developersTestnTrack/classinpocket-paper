import { useQuery } from "react-query";
import { Container, Typography, Button } from "@material-ui/core";
import { Print as PrintIcon } from "@material-ui/icons";

import { Progress } from "@/components/Common";
import { fetchQuestionsByIds } from "@/utils/api/cip-backend/questions";

export function getServerSideProps({ query }) {
    return { props: { ids: query.ids } };
}

export default function PrintPage({ ids }) {
    const { data: list, isLoading, isError } = useQuery("questions", () => fetchQuestionsByIds(ids));

    const paddingOption = (num) => {
        switch (num) {
            case 0:
                return "a";

            case 1:
                return "b";

            case 2:
                return "c";

            case 3:
                return "d";
        }
    };

    if (isLoading) {
        return <Progress />;
    }

    if (isError) {
        return <Typography variant="h4">Error</Typography>;
    }

    return (
        <Container style={{ backgroundColor: "white" }}>
            <Button
                id="print-btn"
                variant="text"
                startIcon={<PrintIcon />}
                onClick={() => {
                    navigator.clipboard
                        .writeText(location.href)
                        .then(() => {
                            window.print();
                        })
                        .catch(() => {
                            window.print();
                        });
                }}
            >
                Print
            </Button>
            {list.map((question, i) => {
                return (
                    <div id="print-row" key={i}>
                        <div>
                            <p id="para">Q: {i + 1}</p>
                        </div>
                        <div id="option">
                            <div
                                id="question-container"
                                dangerouslySetInnerHTML={{ __html: question.question_text }}
                            ></div>
                            {question.question_options.map((option, i) => (
                                <div key={option._id} id="option-container">
                                    <p id="option-text">({paddingOption(i)})</p>
                                    <div dangerouslySetInnerHTML={{ __html: option.text }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </Container>
    );
}
