# NRK TV CLI

Command line client (CLI) for interacting with TV programs from the Norwegian
Broadcasting Corporation (NRK) built on top of the open source package
[`nrk`](https://github.com/Starefossen/node-nrk) for Node.js.

## Install

This program requires Node.js v4 or later installed. ImageMagick is used to
render thumbnail images inside the terminal.

```console
$ npm install nrk-tv-cli
```

## Features

* Search through all of NRK TV
* List episodes for TV series
* List episode details
  * Render thumbnail image
  * Nice tabular layout view
* Download episode m3u8 playlist

## Usage

```console
$ nrk-tv-cli --help

Usage: nrk-tv-cli <command> [options]

command
  version      show package versions
  search       Search all of NRK TV
  episodes     List series episodes
  episode      Get series episode

Options:
   -x, --no-geo-block   Only show items without geo-block
   -a, --avaiable       Only show items which are avaiable
   -v, --verbose        Output verbose information
```

## Legal

NRK is a registered trademark of the Norwegian Broadcast Corporation which is
not affiliated with this product. Content from NRK APIs may be copyrighted.

## [MIT Licensed](https://github.com/Starefossen/nrk-tv-cli/blob/master/LICENSE)
