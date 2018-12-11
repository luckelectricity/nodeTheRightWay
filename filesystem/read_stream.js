require('fs').createReadStream(process.argv[2])
  .on('data', data => process.stdout.write(data))
  .on('error', err => process.stdout.write(`err: ${err.message}\n`))
