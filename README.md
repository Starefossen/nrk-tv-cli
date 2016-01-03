# NRK TV CLI

[![Build status](https://img.shields.io/wercker/ci/567f216a1e29124443152a2e.svg "Build status")](https://app.wercker.com/project/bykey/2e67fadd89cd086636c37bdfccdb0e96)
[![NPM downloads](https://img.shields.io/npm/dm/nrk-tv-cli.svg "NPM downloads")](https://www.npmjs.com/package/nrk-tv-cli)
[![NPM version](https://img.shields.io/npm/v/nrk-tv-cli.svg "NPM version")](https://www.npmjs.com/package/nrk-tv-cli)
[![Node version](https://img.shields.io/node/v/nrk-tv-cli.svg "Node version")](https://www.npmjs.com/package/nrk-tv-cli)
[![Dependency status](https://img.shields.io/david/Starefossen/nrk-tv-cli.svg "Dependency status")](https://david-dm.org/Starefossen/nrk-tv-cli)

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
