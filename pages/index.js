import { useState } from "react";
import { useMutation } from "react-query";
import { Container, Typography, Button } from "@material-ui/core";

import { Progress } from "@/components/Common";
import { submitQuestions } from "@/utils/api/cip-backend/questions";

export default function Home() {
    const [state, setState] = useState(null);
    const { mutate, isLoading } = useMutation((payload) => submitQuestions(payload));

    return (
        <Container maxWidth="md">
            <Typography variant="h5" align="center">
                Please go to admin panel
            </Typography>
            <input
                id="input"
                type="file"
                onChange={(e) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setState(JSON.parse(reader.result));
                    };

                    reader.readAsText(e.target.files[0]);
                }}
            />
            <Button
                variant="text"
                onClick={() => {
                    console.log(state);
                    mutate(state);
                }}
            >
                submit
            </Button>
            {isLoading && <Progress />}
        </Container>
    );
}
