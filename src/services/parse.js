export function parse(text) {
  // line
  text = text.replace(/---|___/g, `<hr>`);
  // font styles
  text = text.replace(/[\*\_]{2}(.*)[\*\_]{2}/gi, "<b>$1</b>");
  text = text.replace(/[\*\_]{1}(.*)[\*\_]{1}/gi, "<i>$1</i>");
  text = text.replace(/[\~]{2}(.*)[\~]{2}/gi, "<del>$1</del>");
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
  text = text.replace(/(?<=\n)[\`]{3}[a-z]+/gi, "<pre>");
  text = text.replace(/[\`]{3}[\n]/g, "</pre>");
  return text;
}