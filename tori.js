import { slackbot } from 'botkit';

import { startHttpd } from 'utils/httpd.js';
import { toriProxy } from 'utils/toriProxy.js';

import { search } from 'controllers/search.js';

const SLACK_TOKEN = process.env.CIBOT_SLACK_TOKEN;


export function run() {
  startHttpd();

  const controller = slackbot({
    debug: process.env.NODE_ENV === 'debug',
  });

  controller.hears('.*', ['direct_mention', 'mention'], toriProxy(search));

  // Spawn application
  controller.spawn({
    token: SLACK_TOKEN,
  }).startRTM();
}
