# asarbreak

break extraction of asar archives using electron/asar cli

## disclaimer

Do not rely on this for any protection, all of the files are still in the archive but just unable to be extracted by the asar utility.
Extracting files one-by-one is possible.

## installation

```shell
# Using your package manager of choice
# Yarn
yarn global add asarbreak
# npm
npm install --global asarbreak

# Then, execute
asarbreak --help
```

## usage

    Usage: asarbreak <input asar>

    Break extraction of asar archives by electron/asar CLI

    Options:
      -V, --version        output the version number
      -n, --no-backup      Overwrites the original asar archive
      --no-delete          Don't unlink the original asar
      --break-windows      Adds invalid entries that will not be able to deleted by Windows Explorer after extraction
                          (default: false)
      --no-invalid-entry   Don't create an invalid entry
      -o, --output [path]  Output file path (defaults to overwrite <input>)
      -d, --duplicate      Duplicates file entries to confuse extraction
      -h, --help           display help for command
