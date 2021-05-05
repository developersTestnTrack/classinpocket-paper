import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

import { PaperHeader, editorHW, buttonList, useEditor } from "@/components/editor/editorUtil";

export default function RenderOptions() {
    const [state, dispatch] = useEditor();

    const {
        question: { options },
    } = state;

    return options.map((option, i) => (
        <Grid item md={12} lg={6} key={i}>
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
            <SunEditor
                placeholder="Enter your option here"
                setContents={option.text}
                onChange={(content) => {
                    dispatch({
                        type: "UPDATE_OPTION",
                        option: { rank: option.rank, text: content },
                    });
                }}
                setOptions={{
                    minHeight: editorHW.option.minHeight,
                    katex: katex,
                    buttonList,
                }}
            />
        </Grid>
    ));
}
