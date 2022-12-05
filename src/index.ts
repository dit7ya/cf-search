async function handleRequest(req) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");
  // const res = await fetch(`https://lite.duckduckgo.com/lite?q=${query}`);
  // const res = await fetch(`https://www.google.com/search?q=${query}`);

  // TODO can we store the list of bangs using KV or cloudflare d1?
  // and retrive them faster than ddg's redirection
  const braveSearchUrl = `https://search.brave.com/search?q=${query}`;
  // if query contains a duckdugo bang, just directly use brave
  // to search for it, the bang can be anywhere in the query
  // e.g. "!g hello world" or "hello !g world" or "hello !amazon books"
  // the bang can contain numbers and letters

  if (query?.match(/!([a-z0-9]+)/)) {
    return Response.redirect(braveSearchUrl, 301);
  }

  const res = await fetch(braveSearchUrl);

  const contentType = res.headers.get("Content-Type");

  // If the response is HTML, it can be transformed with
  // HTMLRewriter -- otherwise, it should pass through
  if (contentType.startsWith("text/html")) {
    return rewriter.transform(res);
  } else {
    return res;
  }
}

class ElementRemover {
  element(element) {
    element.remove();
  }
}

// Hides the element without removing it (positioning is preserved)
class ElementHider {
  element(element) {
    element.setAttribute("style", "visibility: hidden;");
  }
}

class ElementPrinter {
  element(element) {
    console.log(element);
  }
}

const rewriter = new HTMLRewriter()
  .on("script", new ElementRemover())
  .on(`link[rel="search"]`, new ElementRemover())
  .on("footer", new ElementRemover())
  .on("a.btn.ml-15", new ElementRemover())
  .on("#nav-logo", new ElementHider());

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
