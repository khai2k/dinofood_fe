const fs = require('fs')
const path = require('path')
const http = require('http')
const mime = require('mime-types')

// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.env.PORT || 3000

http
  .createServer((req, res) => {
    console.log(`${req.method} | ${req.url}`)

    // extract URL path
    // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
    // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
    // by limiting the path to current directory only
    const sanitizePath = path
      .normalize(req.url.split('?').shift())
      .replace(/^(\.\.[/\\])+/, '')
    let pathname = path.join(__dirname, 'build', sanitizePath)

    // if !exist || is a directory, then look for ./build/index.html
    const exist = fs.existsSync(pathname)
    if (!exist || fs.statSync(pathname).isDirectory()) {
      pathname = path.join(__dirname, 'build', 'index.html')
    }
    const isGzip =
      req.headers['accept-encoding'] &&
      req.headers['accept-encoding'].includes('gzip')
    const pathnameGzip = `${pathname}.gz`
    const contentType = mime.lookup(pathname)
    if (
      isGzip &&
      fs.existsSync(pathnameGzip) &&
      !fs.statSync(pathnameGzip).isDirectory()
    ) {
      pathname = pathnameGzip
      res.setHeader('Content-Encoding', 'gzip')
    }

    // read file from file system
    try {
      const file = fs.readFileSync(pathname, 'binary')
      // based on the URL path, extract the file extention. e.g. .js, .doc, ...
      // if the file is found, set Content-Type and send data
      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Length', file.length)
      res.write(file, 'binary')
      return res.end()
    } catch (error) {
      res.statusCode = 500
      return res.end(`Error getting the file: ${error.message}.`)
    }
  })
  .listen(parseInt(port))

console.log(`Server listening on port: ${port}`)
