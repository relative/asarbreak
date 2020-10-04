/**
 * The first two functions are taken from
 * https://github.com/electron/asar/blob/8a03eae1b888fbbe094d54f8d3e9fbc46188ee61/lib/disk.js
 */
const crypto = require('crypto'),
  pickle = require('chromium-pickle-js'),
  fs = require('fs')

module.exports.readHeader = function readHeader(archive) {
  const fd = fs.openSync(archive, 'r')
  let size
  let headerBuf
  try {
    const sizeBuf = Buffer.alloc(8)
    if (fs.readSync(fd, sizeBuf, 0, 8, null) !== 8) {
      throw new Error('Unable to read header size')
    }

    const sizePickle = pickle.createFromBuffer(sizeBuf)
    size = sizePickle.createIterator().readUInt32()
    headerBuf = Buffer.alloc(size)
    if (fs.readSync(fd, headerBuf, 0, size, null) !== size) {
      throw new Error('Unable to read header')
    }
  } finally {
    fs.closeSync(fd)
  }

  const headerPickle = pickle.createFromBuffer(headerBuf)
  const header = headerPickle.createIterator().readString()
  return { header: JSON.parse(header), headerSize: size }
}
module.exports.createHeader = function createHeader(header) {
  const headerPickle = pickle.createEmpty()
  headerPickle.writeString(JSON.stringify(header))

  const headerBuf = headerPickle.toBuffer()

  const sizePickle = pickle.createEmpty()
  sizePickle.writeUInt32(headerBuf.length)
  const sizeBuf = sizePickle.toBuffer()

  return Buffer.concat([sizeBuf, headerBuf])
}

module.exports.randomIntFromInterval = function randomIntFromInterval(
  min,
  max
) {
  // stolen from stackoverflow
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports.randomIdentifier = () =>
  'uwu' + crypto.randomBytes(24).toString('hex')
