const { readHeader, createHeader } = require('./convenience'),
  { Command } = require('commander'),
  buffer = require('buffer'),
  crypto = require('crypto'),
  path = require('path'),
  fs = require('fs')

const program = new Command()
program
  .version('1.0.0')
  .description('Break extraction of asar archives by electron/asar CLI')
  .usage('<input asar>')
  .option('-n, --no-backup', 'Overwrites the original asar archive')
  .option('--no-delete', "Don't unlink the original asar")
  .option(
    '-o, --output [path]',
    'Output file path (defaults to overwrite <input>)'
  )
  .option('-d, --duplicate', 'Duplicates file entries to confuse extraction')
  .parse(process.argv)

function main() {
  if (program.args.length === 0) return program.help()
  const options = program.opts()
  let source = path.resolve(program.args.join(' ')),
    destination = source
  if (options.output) {
    destination = options.output
  }

  console.log('[*] Reading header')
  let header = readHeader(source)

  if (options.duplicate) {
    console.log('[*] Duplicating entries in file table')

    Object.keys(header.header.files).forEach((key) => {
      let file = header.header.files[key]
      file.size = Math.floor(Math.random() * buffer.constants.MAX_LENGTH) + 1
      file.offset = '-1'
      header.header.files['./' + key] = file
    })
  }

  console.log('[*] Adding invalid entry to file table')
  // add invalid file to the file table
  // adding the entry as early as possible prevents the CLI from extracting files
  header.header.files = Object.assign(
    {},
    {
      ['uwu' + crypto.randomBytes(6).toString('hex')]: {
        size: buffer.constants.MAX_LENGTH,
        offset: '4',
      },
    },
    header.header.files
  )

  console.log('[*] Building new asar header')
  let newHeader = createHeader(header.header)
  console.log('[*] Reading files from original asar')
  let f = fs.readFileSync(source).slice(8 + header.headerSize) // location of file data

  if (options.backup) {
    fs.copyFileSync(source, source + '.bak')
    console.log(
      '[*] Backing up original asar to',
      path.basename(source) + '.bak'
    )
  }
  if (options.delete) {
    console.log('[*] Deleting original asar')
    fs.unlinkSync(source)
  }
  console.log('[*] Writing new asar to disk')
  fs.writeFileSync(destination, Buffer.concat([newHeader, f]))
  console.log('[*] Done!')
}

try {
  main()
} catch (err) {
  console.error(
    '[!] An error occurred while executing\n      ' + err.toString()
  )
}
