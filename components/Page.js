import { useState } from "react";
import Link from "next/link";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";

import StarIcon from "@material-ui/icons/StarBorder";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ManagementIcon from "@material-ui/icons/AccountBalance";
import PaperIcon from "@material-ui/icons/ImportContacts";
import StudentIcon from "@material-ui/icons/LocalLibrary";

import { makeStyles, styled } from "@material-ui/core/styles";

import SideDrawerNav from "./SiderDrawerNav";
import { drawerWidth } from "@/utils/constants";

const useStyles = makeStyles((theme) => ({
    list: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    teacherIcon: {
        marginLeft: theme.spacing(0.8),
    },
    studentIcon: {
        marginLeft: theme.spacing(0.8),
    },
    nestedList: { paddingLeft: theme.spacing(6), cursor: "pointer" },
    contentWrapper: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingLeft: (props) => (props.showSideBar ? drawerWidth + theme.spacing(1) : theme.spacing(1)),
    },
}));

function Page({ children, showSideBar = true }) {
    const classes = useStyles({ showSideBar });
    const [openList, setOpenListState] = useState(false);
    const [openPaperList, setOpenPaperList] = useState(false);

    const onClickManagement = () => {
        setOpenListState(!openList);
    };

    const onClickPaperList = () => {
        setOpenPaperList(!openPaperList);
    };

    return (
        <>
            <SideDrawerNav headername="ClassInPocket" showSideBar={showSideBar}>
                <List aria-labelledby="router-links" className={classes.list}>
                    <Link href="/home">
                        <ListItem button>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </ListItem>
                    </Link>

                    <Link href="/teacher/">
                        <ListItem button>
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                            <ListItemText>Teacher</ListItemText>
                        </ListItem>
                    </Link>

                    <Link href="/student">
                        <ListItem button>
                            <ListItemIcon>
                                <StudentIcon />
                            </ListItemIcon>
                            <ListItemText>Student</ListItemText>
                        </ListItem>
                    </Link>

                    <ListItem button onClick={onClickPaperList}>
                        <ListItemIcon>
                            <PaperIcon />
                        </ListItemIcon>
                        <ListItemText>Paper</ListItemText>
                        {openPaperList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={openPaperList} timeout="auto">
                        <List component="div" disablePadding>
                            <Link href="/paper/list">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>List</ListItemText>
                                </ListItem>
                            </Link>
                            <Link href="/paper/assign">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Assign Copy</ListItemText>
                                </ListItem>
                            </Link>
                            <Link href="/paper/addpaper">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Add Paper</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>

                    <ListItem button onClick={onClickManagement}>
                        <ListItemIcon>
                            <ManagementIcon />
                        </ListItemIcon>
                        <ListItemText>Management</ListItemText>
                        {openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={openList} timeout="auto">
                        <List component="div" disablePadding>
                            <Link href="/board">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Board</ListItemText>
                                </ListItem>
                            </Link>
                            <Link href="/class">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Class</ListItemText>
                                </ListItem>
                            </Link>
                            <Link href="/batch">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Batch</ListItemText>
                                </ListItem>
                            </Link>
                            <Link href="/subject">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Subject</ListItemText>
                                </ListItem>
                            </Link>
                            <Link href="/course">
                                <ListItem button className={classes.nestedList}>
                                    <ListItemIcon>
                                        <StarIcon />
                                    </ListItemIcon>
                                    <ListItemText>Course</ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                </List>
            </SideDrawerNav>
            <div className={classes.contentWrapper}>{children}</div>
        </>
    );
}

export default Page;
