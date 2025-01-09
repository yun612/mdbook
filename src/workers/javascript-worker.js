const postmessage = (status, msg) => self.postMessage({ lang: 'javascript', output: { status, data: msg } })

self.onmessage = async (event) => {
  const { data, ...context } = event.data

  // only run the code if the language is javascript
  const { lang, code } = event.data
  if (lang !== 'javascript') return

  // add all the context to the worker
  for (const key of Object.keys(context)) self[key] = context[key]

  // run the javascript code
  if (!code) postmessage('finished', [{ color: 'red', msg: 'JavaScript code is empty' }])
  else {
    try {
      // Create a function from the code
      const fn = new Function(code)
      
      // Capture console.log output
      const originalLog = console.log
      const logs = []
      console.log = (...args) => {
        logs.push(args)
        postmessage('running', [{ color: 'normal', msg: args }])
      }

      // Run the code
      fn()
      
      // Restore console.log
      console.log = originalLog
      
      postmessage('finished', [])
    } catch (err) {
      postmessage('finished', [{ color: 'red', msg: err.message }])
    }
  }
} 