#!/usr/bin/env node
/* eslint no-console: 0 */
'use strict';

const pkg = require('./package');
const nrk = require('nrk');

const chalk = require('chalk');
const bold = chalk.bold;
const underline = chalk.underline;

const parser = require('nomnom')
  .script(pkg.name)
  .option('no-geo-block', {
    abbr: 'x',
    flag: true,
    help: 'Only show items without geo-block',
  })
  .option('avaiable', {
    abbr: 'a',
    flag: true,
    help: 'Only show items which are avaiable',
  })
  .option('verbose', {
    abbr: 'v',
    flag: true,
    help: 'Output verbose information',
  });

parser.command('version')
  .callback(function versionCb() {
    console.log(`${pkg.name}\tv${pkg.version}`);
    console.log(`nrk\t\tv${pkg.dependencies.nrk.replace('^', '')}`);
  })
  .help('show package versions');

parser.command('search')
  .options({
    query: {
      position: 1,
      help: 'Search query string',
      type: 'string',
      required: true,
    },
    type: {
      abbr: 't',
      type: 'string',
      list: true,
      help: 'Restrict results to given program types',
      choices: ['episode', 'program', 'serie'],
    },
  })
  .callback(function searchCb(opts) {
    nrk.tv.mobil.search(opts.query, function nrkTvMobilSearchCb(err, data) {
      if (err) { throw err; }
      if (!data) { throw new Error('API retuned no data!'); }

      // Filter = avaiability
      if (data.hits && opts.avaiable) {
        data.hits = data.hits.filter(function dataHitsFilter(program) {
          return !program.hit.usageRights
               || program.hit.usageRights.availableFrom <= Date.now()
               && program.hit.usageRights.availableTo > Date.now();
        });
      }

      // Filter = geo-block
      if (data.hits && opts['no-geo-block']) {
        data.hits = data.hits.filter(function dataHitsFilter(program) {
          return !program.hit.usageRights
              || !program.hit.usageRights.geoblocked;
        });
      }

      // Filter = type
      if (data.hits && opts.type) {
        const types = new Set(opts.type);

        data.hits = data.hits.filter(function dataHitsFilter(program) {
          return types.has(program.type);
        });
      }

      if (!data.hits || !data.hits.length) {
        return console.log(bold(`Sorry, no item matched "${opts.query}"`));
      }

      function formatType(type) {
        switch (type) {
          case 'serie': return chalk.cyan('serie');
          case 'episode': return chalk.yellow('episode');
          default: return chalk.magenta(type);
        }
      }

      data.hits.forEach(function dataHitsForEach(program) {
        // console.log(program);
        console.log([
          formatType(program.type),
          bold(program.hit.title),
          `(${(program.hit.programId || program.hit.seriesId)})`,
        ].join(' '));
      });
    });
  })
  .help('Search all of NRK TV');

parser.command('episodes')
  .options({
    id: {
      position: 1,
      help: 'Series id to get episodes for',
      type: 'string',
      required: true,
    },
    season: {
      abbr: 's',
      help: 'Limit episodes to given season',
      type: 'string',
    },
    'only-seasons': {
      help: 'Only list seasons and no episodes',
      flag: true,
    },
  })
  .callback(function episodesCb(opts) {
    nrk.tv.mobil.series(opts.id, function nrkTvMobilSeriesCb(err, data) {
      if (err) { throw err; }
      if (data === null) {
        return console.log(chalk.red(`Sorry, no series matched "${opts.id}"!`));
      }

      console.log(underline.bold(data.title));
      console.log(data.description);
      console.log();

      const seasons = new Map();
      data.seasonIds.forEach(function dataSeasonsIdForEach(season) {
        seasons.set(season.id, season.name);
      });

      // Add season name to all episodes
      data.programs = data.programs.map(function dataProgramsMap(program) {
        program.seasonName = seasons.get(program.seasonId);
        return program;
      });

      // Only list given season
      if (opts.season) {
        const re = new RegExp(opts.season, 'i');
        data.programs = data.programs.filter(function dataProgramFilter(program) {
          return re.test(program.seasonName);
        });
      }

      let seasonId = null;
      data.programs.forEach(function dataProgramsForEach(program) {
        if (seasonId !== program.seasonId) {
          console.log(` • ${bold(program.seasonName)} (${program.seasonId})`);
          seasonId = program.seasonId;
        }

        if (!opts['only-seasons']) {
          console.log([
            '   -',
            program.episodeNumberOrDate,
            program.title,
            `(${program.programId})`,
          ].join(' '));
        }
      });
    });
  })
  .help('List series episodes');

parser.command('episode')
  .options({
    id: {
      position: 1,
      help: 'Episode ID to get details for',
      type: 'string',
      required: true,
    },
  })
  .callback(function episodeCb(opts) {
    nrk.tv.mobil.programs(opts.id, function nrkTvMobilProgramsCb(err, data) {
      if (err) { throw err; }
      if (data === null) {
        return console.log(chalk.red(`Sorry, no episode matched "${opts.id}"!`));
      }

      console.log(`${chalk.underline.bold(data.fullTitle)} (${data.programId})\n`);
      console.log(`${data.description}\n`);

      const AsciiTable = require('ascii-table');
      const table = new AsciiTable();

      table.removeBorder()
        .addRow(bold('Series'), `${data.series.title} (${data.series.seriesId})`)
        .addRow(bold('Category'), data.category.displayValue)
        .addRow(bold('Duration'), `${Math.round(data.duration / 1000 / 60)} minutes`)
        .addRow(bold('Avaiable'), data.isAvailable ? 'Yes' : 'No')
        .addRow(bold('Subtitles'), data.hasSubtitles ? 'Yes' : 'No');

      console.log(table.toString());
      console.log();
      console.log(data.mediaUrl);

      const imageToAscii = require('image-to-ascii');
      const request = require('request');

      const path = `/tmp/${require('uuid').v4()}`;
      const url = `http://gfx.nrk.no/${data.imageId}`;
      request(url)
        .on('error', console.error.bind(console))
        .on('end', function requestEnd() {
          imageToAscii(path, function imageToAsciiCb(asciiErr, ascii) {
            if (asciiErr) { throw asciiErr; }
            console.log();
            console.log(ascii);
            console.log(url);
          });
        })
        .pipe(require('fs').createWriteStream(path));
    });
  })
  .help('Get series episode');

parser.parse();
