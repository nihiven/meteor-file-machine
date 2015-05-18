var WebTorrent = require('webtorrent')
var fs = require('fs')

var client = new WebTorrent()
var magnetUri = 'magnet:?xt=urn:btih:687e19bad9acff9306a60568468a1e6fab2ee8f7&dn=late%20at%20night.mp3'

client.download(magnetUri, function (torrent) {
  // Got torrent metadata!
  console.log('Torrent info hash:', torrent.infoHash)

  torrent.files.forEach(function (file) {
    // Stream each file to the disk
    var source = file.createReadStream()
    var destination = fs.createWriteStream(file.name)
    source.pipe(destination)
  })
})
