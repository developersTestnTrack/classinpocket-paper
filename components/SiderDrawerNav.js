import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import { makeStyles } from "@material-ui/core/styles";

import { drawerWidth } from "../utils/constants";

const useStyles = makeStyles((theme) => ({
    appBar: {
        width: (props) => (props.showSideBar ? `calc(100% - ${drawerWidth}px)` : "100%"),
        marginLeft: drawerWidth,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    sideBarContentContainer: {
        height: "100%",
        width: "100%",
    },
}));

function SideDrawerNav({ headername, showSideBar, children }) {
    const classes = useStyles({ showSideBar });

    return (
        <>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {headername}
                    </Typography>
                </Toolbar>
            </AppBar>

            {showSideBar && (
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    anchor="left"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}></div>
                    <Divider />
                    <div className={classes.sideBarContentContainer}>{children}</div>
                </Drawer>
            )}
            <div className={classes.drawerHeader} />
        </>
    );
}

export default SideDrawerNav;
