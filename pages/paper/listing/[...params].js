import { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { isToday, isFuture, isPast } from "date-fns";

import { Tabs, Tab, Box } from "@material-ui/core";

import Page from "../../../components/Page";
import { useRouter } from "next/router";
import { firestoreDB } from "@/utils/api/firebase-api/fire";
import PaperTable from "@/components/PaperTable";

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

function sortByDate(list, tag) {
    switch (tag) {
        case "CURRENT": {
            return list.filter((el) => isToday(el.start_time.toDate()));
        }

        case "UPCOMING": {
            return list.filter((el) => isFuture(el.start_time.toDate()));
        }

        case "PREVIOUS": {
            return list.filter((el) => isPast(el.start_time.toDate()));
        }

        default: {
            return list;
        }
    }
}

function PaperListPage({ params }) {
    const [tabIndex, setTabIndex] = useState(1);
    const [list, setList] = useState([]);

    useEffect(() => {
        firestoreDB
            .collection("schools")
            .doc(params[0])
            .collection("papers")
            .where("class_id", "==", params[1])
            .get()
            .then((querySnapshot) => {
                const tempDocList = [];
                querySnapshot.forEach((docRef) => {
                    tempDocList.push(docRef.data());
                });
                setList(() => tempDocList);
            });
    }, []);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleChangeIndex = (index) => {
        setTabIndex(index);
    };

    console.log(list);

    return (
        <Page showSideBar={true}>
            <Container maxWidth="lg">
                <Tabs
                    centered
                    value={tabIndex}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="paper categories tabpanel"
                >
                    <Tab label="Previous" />
                    <Tab label="Current" />
                    <Tab label="Upcoming" />
                </Tabs>
                <SwipeableViews index={tabIndex} onChangeIndex={handleChangeIndex}>
                    <TabPanel value={tabIndex} index={0}>
                        <PaperTable list={sortByDate(list, "PREVIOUS")} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <PaperTable list={sortByDate(list, "CURRENT")} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <PaperTable list={sortByDate(list, "UPCOMING")} />
                    </TabPanel>
                </SwipeableViews>
            </Container>
        </Page>
    );
}

export default function Listing() {
    const router = useRouter();

    if (router.query.params) {
        return <PaperListPage params={router.query.params} />;
    }

    return null;
}
