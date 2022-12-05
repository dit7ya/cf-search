async function handleRequest(req) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");
  // const res = await fetch(`https://lite.duckduckgo.com/lite?q=${query}`);
  // const res = await fetch(`https://www.google.com/search?q=${query}`);
  const res = await fetch(`https://search.brave.com/search?q=${query}`);

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
