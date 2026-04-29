document.addEventListener("DOMContentLoaded", function () {
  let publishDate = "";
  let authorName = "Dr. Ravi Somayazula";

  const newSchemaScript = document.getElementById("newschema");

  if (newSchemaScript) {
    try {
      const data = JSON.parse(newSchemaScript.innerText);
      const graph = data["@graph"] || [];
      const blogPost = graph.find((item) => item["@type"] === "BlogPosting");

      if (blogPost && blogPost.datePublished) {
        // Use UTC methods to prevent the +8 hour jump in the Philippines
        const dateObj = new Date(blogPost.datePublished);
        const month = dateObj.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        });
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();

        publishDate = `${month} ${day}, ${year}`;

        if (blogPost.author && blogPost.author.name) {
          authorName = blogPost.author.name;
        }
      }
    } catch (e) {
      console.error("Error parsing schema:", e);
    }
  }

  const title = document.querySelector(".masthead__content__subpage h1");

  if (title && !document.querySelector(".meta-inserted")) {
    const metaContainer = document.createElement("div");
    metaContainer.classList.add("meta-inserted");
    metaContainer.innerHTML = `
      <p>
        ${publishDate ? `<span class="date-stamp">${publishDate}</span>` : ""}
        <span class="author-name">Written by ${authorName}</span>
      </p>
    `;
    title.insertAdjacentElement("afterend", metaContainer);
  }

});


// physically moves the tags container immediately before the surgeon section
document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        const surgeon = document.querySelector('.free-form-238b005a-f99d-4ed9-a70d-e9edcd9fcf14');
        const tags = document.querySelector('.blog-post-tags-page-container');

        if (surgeon && tags) {
            // This physically moves the tags container immediately before the surgeon section
            surgeon.before(tags);
            
            // Force a small layout check
            console.log('DOM updated: Tags moved before the surgeon section.');
        } else {
            console.log('Elements not found for relocation.');
        }
    }
});
