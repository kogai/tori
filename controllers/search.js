function normalizePost(post) {
  return `
    ${post.name} \`${post.created_by.name}\`\n\
    ${post.url}\n
  `;
}

export function search(bot, msg, tori) {
  bot.reply(msg, '記事を探しています...');

  tori.api.posts({
    q: msg.text,
  }, (err, res)=> {
    if (err) {
      console.log(err);
      return bot.reply(msg, err.message);
    }

    if (res.body.posts.length <= 0) {
      return bot.reply(msg, `\`${msg.text}\` では記事が見つかりませんでした`);
    }

    const replies = res.body.posts.map((p)=> {
      return new Promise((resolve, reject)=> {
        bot.reply(msg, normalizePost(p), (replyError)=> {
          if (replyError) {
            return reject(replyError);
          }
          resolve();
        });
      });
    });

    Promise.all(replies).then(()=> {
      const TIMEOUT = process.env.NODE_ENV === 'development' ? 1000 : 1000 * 60 * 3; // ms * s * m
      setTimeout(()=> {
        const conditinos = {
          channel: msg.channel,
          count: 100,
        };

        bot.api.channels.history(conditinos, (historyError, historyRes)=> {
          if (historyError || !historyRes.ok) {
            return bot.reply(msg, historyError.message);
          }

          const botMessages = historyRes.messages.filter((m)=> m.user === bot.identity.id);
          botMessages.forEach((m)=> {
            bot.api.chat.delete({
              channel: msg.channel,
              ts: m.ts,
            });
          });
        });
      }, TIMEOUT);
    })
    .catch((repliesError)=> {
      bot.reply(msg, repliesError.message);
    });
  });
}
