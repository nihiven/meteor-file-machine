// many thanks to Jan Hammer
'use strict'

// required modules
var http = require('http')
var director = require('director')

// set routing paths
var router = new director.http.Router({
  '/': {
    post: postResponse,
    get: getResponse
  }
})

// start listening server
var server = http.createServer(function (req, res) {
  req.chunks = []
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString())
  })

  router.dispatch(req, res, function (err) {
    res.writeHead(err.status, {'Content-Type': 'text/plain'})
    res.end(err.message)
  })
})

var port = Number(process.env.PORT || 5000)
server.listen(port)

function getResponse () {
  this.res.writeHead(200)
  this.res.end('ntunes v0.1')
}

function postResponse () {
  this.res.writeHead(200)
  this.res.end('post')
}
