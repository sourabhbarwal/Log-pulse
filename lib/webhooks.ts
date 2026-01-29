/**
 * Utility to send alerts to Slack and Discord via Webhooks.
 */

export async function sendWebhookAlert(log: {
  level: string;
  message: string;
  source?: string;
  timestamp: string;
}) {
  const { level, message, source, timestamp } = log;
  
  // Format message for Slack
  const slackPayload = {
    text: `🚨 *LogPulse Alert: ${level}*`,
    attachments: [
      {
        color: level === "ERROR" ? "#FF0000" : "#FFA500",
        fields: [
          { title: "Source", value: source || "system", short: true },
          { title: "Time", value: new Date(timestamp).toLocaleString(), short: true },
          { title: "Message", value: message, short: false },
        ],
      },
    ],
  };

  // Format message for Discord
  const discordPayload = {
    embeds: [
      {
        title: `LogPulse Alert: ${level}`,
        color: level === "ERROR" ? 0xFF0000 : 0xFFA500,
        fields: [
          { name: "Source", value: source || "system", inline: true },
          { name: "Time", value: new Date(timestamp).toLocaleString(), inline: true },
          { name: "Message", value: message },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;

  const promises = [];

  if (slackUrl) {
    promises.push(
      fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackPayload),
      }).catch((e) => console.error("Slack webhook failed:", e))
    );
  }

  if (discordUrl) {
    promises.push(
      fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      }).catch((e) => console.error("Discord webhook failed:", e))
    );
  }

  await Promise.all(promises);
}
