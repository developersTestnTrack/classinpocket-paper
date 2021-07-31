import { useQuery } from "react-query";
import { Container, CssBaseline, Typography } from "@material-ui/core";
import { fetchQuestionsByIds } from "@/utils/api/cip-backend/questions";

export function getServerSideProps({ query }) {
    return { props: { ids: query.ids } };
}

export default function PrintPage({ ids }) {
    console.log(ids);
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
        return <p>Loading</p>;
    }

    if (isError) {
        return <Typography variant="h4">Error</Typography>;
    }

    return (
        <CssBaseline>
            <Container>
                <button
                    id="print-btn"
                    onClick={() => {
                        window.print();
                    }}
                >
                    Print
                </button>
                <div id="container">
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
                </div>
            </Container>
        </CssBaseline>
    );
}
