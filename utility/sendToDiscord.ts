import axios from 'axios';

export enum Color {
  RED = 2326507,
  GREEN = 3066993,
  YELLOW = 15844367,
  BLUE = 3447003,
  PURPLE = 10181046,
  ORANGE = 15105570,
  WHITE = 16777215,
  BLACK = 0,
}

export async function sendToDiscord(
  embed: any,
  webhookUrl: string | undefined
) {
  if (
    !process.env.DISCORD_LOGGING ||
    process.env.DISCORD_LOGGING === 'false' ||
    !webhookUrl
  ) {
    return;
  }

  const message = {
    embeds: [embed],
    content: '',
    username: 'Backmind',
  };

  try {
    const res = await axios.post(webhookUrl, message);
  } catch (err) {
    console.log('Error while trying to send discord log message: \n' + err);
  }
}
