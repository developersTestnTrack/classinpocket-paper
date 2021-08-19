import { createContext, useReducer, useContext } from "react";

export const buttonList = [["table", "list", "align", "removeFormat"], ["outdent", "indent"], ["math"], ["image"]];

export const editorHW = {
    main: {
        minHeight: 200,
        maxHeight: 500,
    },
    option: {
        minHeight: 150,
    },
};

export function init(initialState) {
    return initialState;
}

export function questionEditorReducer(state, action) {
    switch (action.type) {
        case "UPDATE_QUESTION_TEXT": {
            return {
                ...state,
                question: {
                    ...state.question,
                    text: action.text,
                },
            };
        }

        case "UPDATE_OPTION": {
            const { question } = state;
            const { options, config } = question;
            const { type } = config;

            const hasStatuskey = Object.keys(action.option).includes("status");

            const newoptions = options.map((el) => {
                //check for status key for updating status
                // otherwise update something else
                if (hasStatuskey) {
                    // check if status has Multiple or Single
                    if (type === "Multiple") {
                        if (el.rank === action.option.rank) {
                            return { ...el, ...action.option };
                        } else {
                            return el;
                        }
                    } else if (type === "Single") {
                        if (el.rank === action.option.rank) {
                            return { ...el, ...action.option };
                        } else {
                            return { ...el, status: false };
                        }
                    }
                } else {
                    if (el.rank === action.option.rank) {
                        return { ...el, ...action.option };
                    } else {
                        return el;
                    }
                }
            });

            return {
                ...state,
                question: {
                    ...question,
                    options: newoptions,
                },
            };
        }

        case "UPDATE_CONFIG": {
            const { question } = state;
            const hasTypeKey = Object.keys(action.config).includes("type");

            if (hasTypeKey) {
                const { options } = question;

                const newoptions = options.map((el) => ({ ...el, status: false }));

                return {
                    ...state,
                    question: {
                        ...question,
                        config: {
                            ...question.config,
                            ...action.config,
                        },
                        options: newoptions,
                    },
                };
            } else {
                return {
                    ...state,
                    question: {
                        ...question,
                        config: {
                            ...question.config,
                            ...action.config,
                        },
                    },
                };
            }
        }

        case "ADD_QUESTION": {
            const { list, question, edit, paper } = state;
            return {
                question: { ...action.nextInitialState },
                list: [...list, { ...question, id: String(Date.now()) }],
                edit,
                paper,
            };
        }

        case "DELETE_QUESTION": {
            const { list } = state;
            const { index } = action;

            let newList = [];

            if (index === 0) {
                newList = newList.concat(list.slice(1));
            } else if (index === list.length - 1) {
                newList = newList.concat(list.slice(0, -1));
            } else if (index > 0) {
                newList = newList.concat(list.slice(0, index), list.slice(index + 1));
            }

            return {
                ...state,
                list: newList,
            };
        }

        case "SAVE_EDIT": {
            const { question, initialState } = action;
            const { list, edit, paper } = state;

            const newlist = list.map((q, i) => {
                if (i === edit.index) {
                    return { ...question };
                } else {
                    return q;
                }
            });

            return {
                question: { ...initialState },
                edit: { isEditing: false, index: 0 },
                list: newlist,
                paper,
            };
        }

        case "ENABLE_EDIT": {
            const { list, paper } = state;
            const { index, selectedQuestion } = action;

            return {
                question: {
                    ...selectedQuestion,
                },
                edit: {
                    isEditing: true,
                    index: index,
                },
                list,
                paper,
            };
        }

        case "DISABLE_EDIT": {
            const { initialState } = action;
            const { list, paper } = state;

            return {
                question: { ...initialState },
                edit: { isEditing: false, index: 0 },
                list,
                paper,
            };
        }

        case "UPDATE_LIST_ORDER": {
            const { list } = state;
            const tempList = [...list];
            const { removedIndex, addedIndex } = action.value;
            const [deletedItem] = tempList.splice(removedIndex, 1);
            tempList.splice(addedIndex, 0, deletedItem);

            return {
                ...state,
                list: tempList,
            };
        }
    }
}

const EditorContext = createContext();
const EditorDispatchContext = createContext();

const EditorProvider = EditorContext.Provider;
const EditorDispatchProvider = EditorDispatchContext.Provider;

export function useEditorState() {
    const context = useContext(EditorContext);

    if (context === undefined) {
        throw new Error("useFormState must be used within a EditorProvider");
    }

    return context;
}

export function useEditorDispatch() {
    const context = useContext(EditorDispatchContext);

    if (context === undefined) {
        throw new Error("useFormDispatch must be used within a EditorDispatchProvider");
    }

    return context;
}

export function useEditor() {
    return [useEditorState(), useEditorDispatch()];
}

export function EditorGlobal({ initialState, children }) {
    const [state, dispatch] = useReducer(questionEditorReducer, initialState, init);

    return (
        <EditorProvider value={state}>
            <EditorDispatchProvider value={dispatch}>{children}</EditorDispatchProvider>
        </EditorProvider>
    );
}
