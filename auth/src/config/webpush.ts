import webPush from "web-push";

export const initWebPush = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys missing in environment");
  }

  webPush.setVapidDetails(
    "mailto:admin@localhost",
    publicKey.trim(),
    privateKey.trim()
  );

};

export default webPush;
