const lt_regex = /</g;
const gt_regex = />/g;
const br_regex = /\n|\r|↵|\u21b5/g;
const hash_regex = /\#/gi;
const tag_regex = /<[^>]*>/gi;
const space_regex = /\s/g;
const marked_regex = /(\&lt;mark\&gt;)(.*)(\&lt;\/mark\&gt;)/gi;
//* order matters
export function parse(md) {
  let text = md;
  // tags
  text = text.replace(tag_regex, str => str.replace(lt_regex, "&lt;").replace(gt_regex, "&gt;"));
  // skiping marked tags
  text = text.replace(marked_regex, str => {
    str = str.replace(/\&lt;/g, "<");
    str = str.replace(/\&gt;/g, ">");
    return str;
  });

  //! start MD
  // line
  text = text.replace(/[\-\_]{3}/g, `<hr>`);
  // image - must before link
  text = text.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/gi, `<img src="$2" alt="$1" />`);
  // link
  text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/gi, `<a href="$2" target="_blank">$1</a>`);
  //? fix urls src & href attributes
  text = text.replace(/src=\"([^"]*)\"|href=\"([^"]*)\"/gi, str => {
    return str.replace(/\_/g, "&lowbar;").replace(/\#/g, "&num;").replace(/\*/g, "&ast;").replace(/\~/g, "&tilde;");
  });
  // font styles
  text = text.replace(/[\_\*]{2}([^\_\*].*?)[\_\*]{2}/g, "<b>$1</b>");
  text = text.replace(/[\~]{2}([^\~].*?)[\~]{2}/gi, "<del>$1</del>");
  text = text.replace(/[\_\*]{1}([^\_\*].*?)[\_\*]{1}/g, "<i>$1</i>");
  // code 
  text = text.replace(/[\`]{3}([a-z]+)([^\`]+)[\`]{3}/gi, (str, str2, str3) => {
    str3 = str3
      .replace(/\>/g, "&gt;")
      .replace(/\</g, "&lt;")
      .replace(/\_/g, "&lowbar;")
      .replace(/\#/g, "&num;")
      .replace(/\*/g, "&ast;")
      .replace(/\~/g, "&tilde;")
      .replace(/\`/g, "&grave;")
      .replace(/\$/g, "&dollar;");
    return `<pre><code class="language-${str2}">${str3}</code></pre>`;
  });
  text = text.replace(/<pre[\s\S]*?>[\s\S]*?<\/pre>/gi, str => str.replace(hash_regex, "&num;"));
  // heading - must be a descending order
  text = text.replace(/[#]{6}(.*)/gi, `<h6>$1</h6>`);
  text = text.replace(/[#]{5}(.*)/gi, `<h5>$1</h5>`);
  text = text.replace(/[#]{4}(.*)/gi, `<h4>$1</h4>`);
  text = text.replace(/[#]{3}(.*)/gi, `<h3>$1</h3>`);
  text = text.replace(/[#]{2}(.*)/gi, `<h2>$1</h2>`);
  text = text.replace(/[#]{1}(.*)/gi, `<h1>$1</h1>`);
  // task list
  text = text.replace(/([\*\-][\s]?\[x\])(.*)/g, `<p class="tasklist"><input type="checkbox" checked disabled/>$2</p>`);
  text = text.replace(/([\*\-][\s]?\[\s?\])(.*)/g, `<p class="tasklist"><input type="checkbox" disabled/>$2</p>`);
  // li - must be the last one
  text = text.replace(/\*(.*)/g, `<p class="li">$1</p>`);
  // quote code
  text = text.replace(/^[\>]{1}(.*)/gm, `<blockquote><p>$1</p></blockquote>`);
  // quote text
  text = text.replace(/\`([^\`].*?)\`/gi, `<p class="quoteText">$1</p>`);
  //! end MD

  // line break
  text = text.replace(br_regex, `<div class="br"></div>`);
  //? fix non-breaking space
  text = text.replace(space_regex, "&nbsp;");
  text = text.replace(tag_regex, str => str.replace(/\&nbsp\;/g, " "));

  return text.trim();
}
