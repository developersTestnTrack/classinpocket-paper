import dynamic from "next/dynamic";

const Pdf = dynamic(() => import("../components/PdfGen"), { ssr: false });

export default function Home() {
    return <Pdf />;
}
