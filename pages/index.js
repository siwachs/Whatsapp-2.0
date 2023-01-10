import Head from "next/head";

//Home Page Components...
import SideBar from "./components/SideBar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>WhatsApp 2.0</title>
        <meta name="description" content="Clone of WhatsApp web version" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SideBar />
    </div>
  );
}
