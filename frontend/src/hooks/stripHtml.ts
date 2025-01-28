export function stripHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
  
    // Replace `<br>` and block elements with newline characters
    div.querySelectorAll("br").forEach(br => (br.replaceWith("\n")));
    div.querySelectorAll("p, div").forEach(block => {
      const textNode = document.createTextNode("\n");
      block.parentNode?.insertBefore(textNode, block.nextSibling);
    });
  
    const text = div.textContent || div.innerText || "";
    return text.trim(); // Trim to clean up leading/trailing spaces or extra newlines
  }
  