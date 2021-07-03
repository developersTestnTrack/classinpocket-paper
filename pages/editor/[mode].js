import { Container, Grid, TextField, MenuItem } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { firestoreDB } from "@/utils/api/firebase-api/fire";

export async function getServerSideProps({ params }) {
    const docRef = await firestoreDB.collection("classinpocket").doc(params.mode).get();
    return {
        props: { mode: params.mode, payload: JSON.parse(JSON.stringify(docRef.data())) },
    };
}

/**
 * @param {Object} editor - The payload for editor.
 * @param {string} editor.mode - editor mode.
 * @param {Object} editor.payload - editor payload object.
 * @param {string} editor.payload.type - mode type
 * @param {string[]} editor.payload.board_list - board list
 * @param {string[]} editor.payload.class_list - class list
 * @param {string[]} editor.payload.subject_list - subject list
 * @param {string[]} editor.payload.paper_cat_list - paper catagory list
 */
export default function Editor({ mode, payload }) {
    console.log(mode);
    console.log(payload);

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} />
                <Grid item xs={6}>
                    <TextField fullWidth variant="outlined" label="Board" placeholder="Select Board" select>
                        {payload.board_list.map((board) => (
                            <MenuItem key={board} value={board}>
                                {board}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth variant="outlined" label="Class" placeholder="Select Class" select>
                        {payload.class_list.map((klass) => (
                            <MenuItem key={klass} value={klass}>
                                {klass}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth variant="outlined" label="Subject" placeholder="Select Subject" select>
                        {payload.subject_list.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                                {subject}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth variant="outlined" label="Category" placeholder="Select Category" select>
                        {payload.paper_cat_list.map((paperCat) => (
                            <MenuItem key={paperCat} value={paperCat}>
                                {paperCat}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth variant="outlined" label="Marks" placeholder="Select Marks" select>
                        {["1", "2", "3", "4", "5"].map((num) => (
                            <MenuItem key={num} value={num}>
                                {num}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <ChipInput fullWidth variant="outlined" label="Topic" placeholder="Enter Topics" />
                </Grid>
                <Grid item xs={12}>
                    <ChipInput fullWidth variant="outlined" label="Chapter" placeholder="Enter Chapters" />
                </Grid>
            </Grid>
        </Container>
    );
}
