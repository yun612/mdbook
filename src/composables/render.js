export function renderMarkdown(content) {
    if (!content) {
      return { html: '', anchors: [] }
    }
    console.log(content)
    // const renderer = new marked.Renderer()
    // let anchors = []
    // let anchorsId = 0

  
    // renderer.heading = (text, level, raw) => {
    //   anchorsId++
    //   const escapedText = `toc_${anchorsId}_${text.toLowerCase().replace(/[^\w]+/g, '-').replace(/-$/, '')}`
    //   anchors.push({ id: escapedText, name: text, indent: level })
    //   return `<h${level} id="${escapedText}">${text}</h${level}>`
    // }
  
    // renderer.code = function (code, language) {
    //   if (language) {
    //     return `<pre><code class="hljs language-${language} rounded-lg mx-1">${hljsRender(code, language)}</code></pre>`;
    //   } else {
    //     return `<pre><code class="hljs rounded-lg mx-1">${code}</code></pre>`;
    //   }
    // };
    // renderer.codespan = (text) => {
    //   return `<span class="text-orange-500 bg-gray-50 mx-0.5 py-0.5 px-1 rounded">${text}</span>`;
    // };
    // const htmlResult = marked.parse(content, { renderer })
    // return {
    //   html: htmlResult,
    //   anchors
    // }
  }