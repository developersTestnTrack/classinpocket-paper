import { useEffect, useRef } from "react";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "../utils/theme";
import "../styles/print.css";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const queryClientRef = useRef();
    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient();
    }

    return (
        <>
            <Head>
                <title>ClassInPocket</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <QueryClientProvider client={queryClientRef.current}>
                <Hydrate state={pageProps.dehydratedState}>
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Hydrate>
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
