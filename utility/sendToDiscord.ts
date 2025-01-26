import axios from 'axios';

export enum Channel {
  REGISTER = 'https://discord.com/api/webhooks/1332995401221144697/lEzYL1otK2xotPEU0CeeQE_WaUYmGDeVUsFyMxupMd9bj6eWRdppfZv4VH0AxD7fGNCH',
  LOGIN = 'https://discord.com/api/webhooks/1332997813805645865/k9RBZSPMY_59fcaeeKBcqY08D2UXCiyL6w7df0K4RaDqXCFVt4LfIRUv2hh5_6FSaIMP',
  GET_PROFILE = 'https://discord.com/api/webhooks/1332997906981982228/ChC65cYO2p_RIFOW2Vh6EXSAcetRYze6BuNIuPFQ9jy22LOWxKvzHOTQS6euRpS2JwSi',
}

export async function sendToDiscord(embed: any, channel: Channel) {
  const message = {
    embeds: [embed],
    content: '',
    username: 'Backmind',
  };

  try {
    const res = await axios.post(channel, message);
  } catch (err) {
    console.log('Error while trying to send discord log message: \n' + err);
  }
}
