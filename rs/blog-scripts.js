// document.addEventListener("DOMContentLoaded", () => {
//     // 1. CONFIGURATION
//     const postsPerPage = 21;
//     const placeholderUrl = "https://cms-site-bucket.s3.us-west-2.amazonaws.com/site-assets/bodybyravi.com/masthead/a-blog.jpg";
//     const container = document.querySelector(".regular-posts-grid");

//     if (!container) return;

//     const blogPosts = Array.from(container.querySelectorAll(".blog-post-item"));

//     // 2. DETECT CURRENT PAGE (Handling /blog as Page 1)
//     const path = window.location.pathname;
//     const pageMatch = path.match(/\/page-(\d+)\/?$/);
//     // If no match and path is /blog or /blog/, default to 1
//     const currentPage = pageMatch ? parseInt(pageMatch[1]) : 1;

//     // 3. SAFETY CHECK: If the page requested is empty
//     const totalPages = Math.ceil(blogPosts.length / postsPerPage);

//     if (currentPage > totalPages || blogPosts.length === 0) {
//         container.innerHTML = `
//             <div style="text-align:center; padding: 60px 20px; width: 100%; grid-column: 1 / -1;">
//                 <h3 style="color: #666;">No more articles available.</h3>
//                 <p>Check back later for new updates.</p>
//                 <a href="/blog/" class="rl-read-more" style="display:inline-block; margin-top: 20px; float:none;">Back to Blog</a>
//             </div>`;
//         // Still render pagination so they can go back
//         renderSmartPagination(container, currentPage, totalPages);
//         return;
//     }

//     // 4. SORTING
//     blogPosts.sort((a, b) => {
//         const dateStrA = a.querySelector(".blog-date")?.innerText || "";
//         const dateStrB = b.querySelector(".blog-date")?.innerText || "";
//         return new Date(dateStrB) - new Date(dateStrA);
//     });

//     // 5. CALCULATION & FILTERING
//     const start = (currentPage - 1) * postsPerPage;
//     const end = start + postsPerPage;

//     blogPosts.forEach((post, index) => {
//         if (index >= start && index < end) {
//             post.style.display = "flex";
//             container.appendChild(post);
//             renderPostExtras(post);
//         } else {
//             post.remove();
//         }
//     });

//     // 6. RENDER NAVIGATION
//     if (totalPages > 1) {
//         renderSmartPagination(container, currentPage, totalPages);
//     }

//     // Helper: Image Recovery & Buttons
//     function renderPostExtras(post) {
//         const imageLink = post.querySelector("a:first-of-type");
//         if (imageLink && (imageLink.innerHTML.trim() === "" || imageLink.innerHTML === "&nbsp;")) {
//             const hiddenImg = post.querySelector(".blog-post-item-content img");
//             const wrapper = document.createElement("div");
//             wrapper.className = "gatsby-image-wrapper";
//             const finalImg = document.createElement("img");
//             finalImg.src = hiddenImg ? hiddenImg.src : placeholderUrl;
//             wrapper.appendChild(finalImg);
//             imageLink.innerHTML = "";
//             imageLink.appendChild(wrapper);
//         }

//         const contentArea = post.querySelector(".blog-post-item-content");
//         if (contentArea && !post.querySelector(".rl-read-more")) {
//             const postUrl = post.querySelector("a")?.getAttribute("href");
//             const btn = document.createElement("a");
//             btn.href = postUrl;
//             btn.className = "rl-read-more";
//             btn.innerText = "Read More";
//             contentArea.appendChild(btn);
//         }
//     }

//     // Helper: Smart Pagination with Dots
//     function renderSmartPagination(target, current, total) {
//         const nav = document.createElement("div");
//         nav.className = "rl-pagination-container";

//         const getUrl = (n) => {
//             // Cleans the URL to find the base /blog path
//             const base = path.replace(/\/page-\d+\/?$/, '').replace(/\/$/, '');
//             return n === 1 ? `${base}/` : `${base}/page-${n}/`;
//         };

//         const addBtn = (label, n, active = false, disabled = false) => {
//             const btn = document.createElement(disabled || active ? "span" : "a");
//             if (!disabled && !active) btn.href = getUrl(n);
//             btn.innerText = label;
//             btn.className = `rl-page-num ${active ? 'rl-active' : ''}`;
//             if (disabled) btn.style.opacity = "0.3";
//             nav.appendChild(btn);
//         };

//         addBtn("<", current - 1, false, current === 1);

//         const range = 1;
//         for (let i = 1; i <= total; i++) {
//             if (i === 1 || i === total || (i >= current - range && i <= current + range)) {
//                 addBtn(i, i, i === current);
//             } else if (i === current - range - 1 || i === current + range + 1) {
//                 const dots = document.createElement("span");
//                 dots.className = "rl-dots";
//                 dots.innerText = "...";
//                 nav.appendChild(dots);
//             }
//         }

//         addBtn(">", current + 1, false, current >= total);
//         target.after(nav);
//     }
// });

(function () {
  const AUTHOR_NAME = "Dr. Ravi Somayazula";
  const TARGET_SELECTOR = ".blog-post-item-content";
  const DATE_SELECTOR = ".blog-date";

  function doInjection() {
    const posts = document.querySelectorAll(TARGET_SELECTOR);

    posts.forEach((post) => {
      // Check if already injected to prevent duplicates
      if (post.querySelector(".blog-author-inserted")) return;

      const dateEl = post.querySelector(DATE_SELECTOR);
      if (dateEl) {
        const authorP = document.createElement("p");
        authorP.className = "blog-author-inserted";
        authorP.style.cssText = "color: rgb(93, 108, 110); margin-top: 8px;";
        authorP.innerHTML = `<em>Written by ${AUTHOR_NAME}</em>`;

        dateEl.after(authorP);
      }
    });
  }

  // 1. Run immediately on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", doInjection);
  } else {
    doInjection();
  }

  // 2. Watch for changes (Pagination/Filtering)
  const container = document.querySelector(".regular-posts-grid");
  if (container) {
    const observer = new MutationObserver((mutations) => {
      // Re-run injection if nodes are added
      doInjection();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });
  }
})();
