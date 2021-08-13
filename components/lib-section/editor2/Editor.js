import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";

import { buttonList } from "./editorUtil";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

export default function Editor({ setOptions, ...restProps }) {
    return (
        <SunEditor
            setOptions={{
                buttonList,
                katex: katex,
                minHeight: 600,
                ...setOptions,
            }}
            {...restProps}
        />
    );
}
