#!/usr/bin/env Node

require('fs').createReadStream(process.argv[2]).pipe(process.stdout)
