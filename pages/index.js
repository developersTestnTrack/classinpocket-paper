import dynamic from "next/dynamic";
import { Container, Typography } from "@material-ui/core";

const PDFViewer = dynamic(() => import("@/components/PdfView"), { ssr: false });

export default function Home() {
    return (
        <Container maxWidth="xl">
            <Typography variant="h5" align="center">
                Please go to admin panel
            </Typography>
            <PDFViewer />
        </Container>
    );
}
