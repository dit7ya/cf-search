// const OLD_URL = "developer.mozilla.org";

// const NEW_URL = "mynewdomain.com";

async function handleRequest(req) {
  // console.log(req);
  const url = new URL(req.url);
  const query = url.searchParams.get("q");
  // const res = await fetch(`https://lite.duckduckgo.com/lite?q=${query}`);
  const res = await fetch(`https://www.google.com/search?q=${query}`);

  const contentType = res.headers.get("Content-Type");

  console.log(contentType);
  // If the response is HTML, it can be transformed with
  // HTMLRewriter -- otherwise, it should pass through
  if (contentType.startsWith("text/html")) {
    return rewriter.transform(res);
  } else {
    return res;
  }
}

// class AttributeRewriter {
//   constructor(attributeName) {
//     this.attributeName = attributeName;
//   }
//   element(element) {
//     const attribute = element.getAttribute(this.attributeName);
//     if (attribute) {
//       element.setAttribute(
//         this.attributeName,
//         attribute.replace(OLD_URL, NEW_URL)
//       );
//     }
//   }
// }

class ElementRemover {
  element(element) {
    element.remove();
  }
}

const rewriter = new HTMLRewriter().on("script", new ElementRemover());
// .on("a", new AttributeRewriter("href"))
// .on("img", new AttributeRewriter("src"));

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
