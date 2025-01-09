// Import Babel from CDN
self.importScripts("https://unpkg.com/@babel/standalone@7.23.7/babel.min.js");

const postmessage = (status, msg) => self.postMessage({ lang: "typescript", output: { status, data: msg } });

self.onmessage = async (event) => {
  const { data, ...context } = event.data;

  // only run the code if the language is typescript
  const { lang, code } = event.data;
  if (lang !== "typescript") return;

  // add all the context to the worker
  for (const key of Object.keys(context)) self[key] = context[key];

  // run the typescript code
  if (!code) {
    postmessage("finished", [{ color: "red", msg: ["TypeScript code is empty"] }]);
  } else {
    try {
      // Transform TypeScript to JavaScript using Babel
      const result = Babel.transform(code, {
        filename: "input.ts",
        presets: ["typescript"],
        retainLines: true
      });

      // Create a function from the compiled code
      const fn = new Function(result.code);

      // Capture console.log output
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => {
        logs.push(args);
        postmessage("running", [{ color: "normal", msg: args }]);
      };

      // Run the code
      fn();

      // Restore console.log
      console.log = originalLog;

      postmessage("finished", []);
    } catch (err) {
      postmessage("finished", [{ color: "red", msg: [err.message] }]);
    }
  }
}; 