import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PDFViewer() {
    const [file, setFile] = useState(
        "https://firebasestorage.googleapis.com/v0/b/classinpocket-f5907.appspot.com/o/solutions?alt=media&token=4fb07a80-dffc-4bd0-a5c6-6b1331acb84c"
    );
    const [numPages, setNumPages] = useState(null);

    function onFileChange(event) {
        setFile(event.target.files[0]);
    }

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    return (
        <div>
            <div>
                <label htmlFor="file">Load from file:</label> <input onChange={onFileChange} type="file" />
            </div>
            <div>
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from({ length: numPages }, (_, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
}
