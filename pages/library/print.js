import { useQuery } from "react-query";
import { Typography, Button, Container } from "@material-ui/core";
import { Print as PrintIcon } from "@material-ui/icons";

import { Progress } from "@/components/Common";
import { fetchQuestionsByIds } from "@/utils/api/cip-backend/questions";

export function getServerSideProps({ query }) {
    console.log(query);
    return { props: { ids: query.ids, details: JSON.parse(query.details) } };
}

export default function PrintPage({ ids, details }) {
    console.log(details);
    const { data: list, isLoading, isError } = useQuery("questions", () => fetchQuestionsByIds(ids), {
        refetchOnWindowFocus: false,
    });

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

    const doubleDigitNum = (num) => {
        if (num < 10) {
            return `0${num}`;
        }
        return num;
    };

    if (isLoading) {
        return <Progress />;
    }

    if (isError) {
        return <Typography variant="h4">Error</Typography>;
    }

    return (
        <Container maxWidth="md" style={{ backgroundColor: "white" }}>
            <div id="container">
                <div id="inner-container">
                    <div id="header">
                        <div id="inner-header">
                            <h4>Class: {details.klass}</h4>
                            <h4>Subject: {details.subject}</h4>
                            <h4>Marks: {details.marks}</h4>
                        </div>
                        <img id="logo" src="/logo.png" alt="logo" width="120" height="50" />
                    </div>
                    <hr />
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
                                    <p id="para">Q: {doubleDigitNum(i + 1)}</p>
                                </div>
                                <div id="option">
                                    <div
                                        id="question-container"
                                        dangerouslySetInnerHTML={{ __html: question.question_text }}
                                    ></div>
                                    {question.hasOption &&
                                        question.question_options.map((option, i) => (
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
            </div>
        </Container>
    );
}
