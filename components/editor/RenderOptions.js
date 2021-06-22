import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

import { PaperHeader, useEditor, editorHW } from "@/components/editor/editorUtil";
import Editor from "./Editor";

export default function RenderOptions() {
    const [state, dispatch] = useEditor();

    const {
        question: { options },
    } = state;

    return options.map((option, i) => (
        <Grid item md={12} lg={12} key={i}>
            <PaperHeader>
                <Typography variant="h6">Option: {option.rank}</Typography>
                <Switch
                    checked={option.status}
                    onChange={() => {
                        dispatch({
                            type: "UPDATE_OPTION",
                            option: { rank: option.rank, status: !option.status },
                        });
                    }}
                />
            </PaperHeader>
            <Editor
                placeholder="Enter your option here"
                setContents={option.text}
                setOptions={{
                    minHeight: editorHW.main.minHeight,
                }}
                onChange={(content) => {
                    dispatch({
                        type: "UPDATE_OPTION",
                        option: { rank: option.rank, text: content },
                    });
                }}
            />
        </Grid>
    ));
}
