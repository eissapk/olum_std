const lt_regex = /</g;
const gt_regex = />/g;
const br_regex = /\n|\r|↵|\u21b5/g;

export function parse(text) {
  // tags
  text = text.replace(/<[^>]*>/gi, str => str.replace(lt_regex, "&lt;").replace(gt_regex, "&gt;"));

  //! start MD
  // line
  text = text.replace(/---|___/g, `<hr>`);
  // font styles
  text = text.replace(/([\*\_]{2})(.*)([\*\_]{2})/g, "<b>$2</b>");
  text = text.replace(/([\~]{2})(.*)([\~]{2})/gi, "<del>$2</del>");
  text = text.replace(/([\*\_]{1})(.*)([\*\_]{1})/gi, "<i>$2</i>");
  // image - must before link
  text = text.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/gi, `<img src="$2" alt="$1" />`);
  // link
  text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/gi, `<a href="$2" target="_blank">$1</a>`);
  // heading - must be a descending order
  text = text.replace(/[#]{6}(.*)/gi, "<h6>$1</h6>");
  text = text.replace(/[#]{5}(.*)/gi, "<h5>$1</h5>");
  text = text.replace(/[#]{4}(.*)/gi, "<h4>$1</h4>");
  text = text.replace(/[#]{3}(.*)/gi, "<h3>$1</h3>");
  text = text.replace(/[#]{2}(.*)/gi, "<h2>$1</h2>");
  text = text.replace(/[#]{1}(.*)/gi, "<h1>$1</h1>");
  // code
  text = text.replace(/([\`]{3}[a-z]+)/gi, "<pre>");
  text = text.replace(/([\`]{3}[^a-z])/gi, "</pre>");
  // task list
  text = text.replace(/([\*\-][\s]?\[x\])(.*)/g, `<p class="tasklist"><input type="checkbox" checked disabled/>$2</p>`);
  text = text.replace(/([\*\-][\s]?\[\s?\])(.*)/g, `<p class="tasklist"><input type="checkbox" disabled/>$2</p>`);
  // li - must be the last one
  text = text.replace(/\*(.*)/g, `<p class="li">$1</p>`);
  // quote
  text = text.replace(/^[\>]{1}(.*)/gm, `<blockquote>$1</blockquote>`);
  //! end MD

  // line break
  text = text.replace(br_regex, `<div class="br"></div>`);
  // clean
  text = text.replace(/([\`]{3})$/, "").trim();

  return text;
}