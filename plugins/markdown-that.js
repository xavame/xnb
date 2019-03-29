const md = require('markdown-it')({
  html: true,
  linkify: true
})

md.use(require('markdown-it-highlightjs'), {
  auto:false
})
.use(require('markdown-it-katex'))
.use(require('markdown-it-sup'))
.use(require('markdown-it-sub'));

getAttr = (token, attr) => {
  let returnObj = token.attrs[token.attrIndex(attr)];
  return typeof returnObj !== "undefined" ? returnObj[1] : "";
}

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  let token = tokens[idx],
      href = getAttr(token, 'src'),
      text = getAttr(token, 'alt'),
      title = getAttr(token, 'title');

  //IF AUDIO
  let audioFiles = ["mp3", "wav", "ogg", "flac", "aiff", "mid", "aac", "wma", "alac", "ape"]
  if (audioFiles.some((s) => href.toLowerCase().endsWith(s))) {
    tokens[idx]["tag"] = "audio-player";
    console.log(tokens[idx]);
    return self.renderToken(tokens, idx, options);
  }

  return (title ? `<figure class='${title}'>` : "")
            + `<image-responsive class="${title}" imageURL="${href}" alt="${text}" title="${text}">`
            + ((title && text) ? `<figcaption>${text}</figcaption></figure>` : `</figure>`)
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx]["tag"] = "md-link";
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_close = function () { return '</md-link>' }


module.exports = {
  md: (m) => {
    return md.render(m)
  }
}