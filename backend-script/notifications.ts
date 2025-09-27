import 'dotenv/config';

const APP_ID = process.env.APP_ID!;
const API_KEY = process.env.NOTIFICATIONS_API_KEY;

interface NotificationPayload {
  walletAddress: string;
  title: string;
  message: string;
  path?: string;
}

export async function sendKarmaNotification({
  walletAddress,
  title,
  message,
  path = '/'
}: NotificationPayload) {

  // Skip if no API key configured
  if (!API_KEY) {
    console.log('⚠️  Notification skipped (no API_KEY configured):', { walletAddress, title, message });
    return;
  }

  try {
    console.log('📱 Sending notification to:', walletAddress);

    const response = await fetch(
      "https://developer.worldcoin.org/api/v2/minikit/send-notification",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: APP_ID,
          wallet_addresses: [walletAddress],
          localisations: [
            {
              language: "en",
              title,
              message,
            },
          ],
          mini_app_path: `worldapp://mini-app?app_id=${APP_ID}&path=${path}`,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Notification sent successfully:', result);
    } else {
      const error = await response.text();
      console.error('❌ Notification failed:', response.status, error);
    }

  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
}

// Karma-specific notification functions
export async function notifyKarmaReceived(
  walletAddress: string,
  amount: string,
  fromAddress: string,
  reason: string
) {
  await sendKarmaNotification({
    walletAddress,
    title: "🎉 Karma Received!",
    message: `You received ${amount} karma from ${fromAddress.slice(0, 6)}...${fromAddress.slice(-4)} - ${reason}`,
    path: "/profile"
  });
}

export async function notifyKarmaSlashed(
  walletAddress: string,
  amount: string,
  fromAddress: string,
  reason: string
) {
  await sendKarmaNotification({
    walletAddress,
    title: "⚠️ Karma Slashed",
    message: `${amount} karma was slashed by ${fromAddress.slice(0, 6)}...${fromAddress.slice(-4)} - ${reason}`,
    path: "/profile"
  });
}

export async function notifyRedistribution(walletAddresses: string[]) {
  // Send to multiple users
  for (const address of walletAddresses) {
    await sendKarmaNotification({
      walletAddress: address,
      title: "🎊 Karma Redistribution!",
      message: "The daily karma redistribution has occurred. Check your updated balance!",
      path: "/"
    });
  }
}