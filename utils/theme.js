import { createMuiTheme } from "@material-ui/core/styles";
import { red, orange } from "@material-ui/core/colors";
// #556cd6
// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: orange.A400,
        },
        secondary: {
            main: "#19857b",
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#eceff1",
        },
    },
});

export default theme;
