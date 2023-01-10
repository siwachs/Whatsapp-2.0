import Head from "next/head";
import Image from "next/image";

import { Circle } from "better-react-spinkit";

const Loading = () => {
  return (
    <center
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
      }}
    >
      <Head>
        <title>Initializing...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <Image
          src="/WhatsApp.svg"
          alt=""
          height={200}
          width={200}
          style={{
            objectFit: "contain",
            marginBottom: 20,
          }}
          priority={true}
        />
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
};

export default Loading;
