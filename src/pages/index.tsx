import Head from "next/head";
import App from "./_app";

export default function Index() {

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="./favicon.ico"/>
        <title>Policy Compliance System</title>
      </Head>
      <body>
        <App />
      </body>
    </html>
  );
}
