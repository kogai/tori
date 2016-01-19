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
    res.body.posts.forEach((p)=> bot.reply(msg, normalizePost(p)));
  });
}
