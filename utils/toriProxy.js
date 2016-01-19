import esa from 'esa-nodejs';

const ESA_ACCESS_TOKEN = process.env.ESA_ACCESS_TOKEN;
const ESA_TEAM_NAME = process.env.ESA_TEAM_NAME;

const tori = esa({
  team: ESA_TEAM_NAME,
  accessToken: ESA_ACCESS_TOKEN,
});

export function toriProxy(callback) {
  return (bot, msg)=> {
    callback(bot, msg, tori);
  };
}
