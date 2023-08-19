#!/usr/bin/env node

/**
 * @author Julien 'Blaxar' Bardagi <blaxar.waldarax@gmail.com>
 */

import {createConnection} from 'typeorm';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .command('* sql', 'Load WideWorlds sqlite3 database to find sign' +
             ' props holding user names and their respective IDs, then' +
             ' update all the found user entries with those names',
    (yargs) => {
      yargs.positional('sql', {
        description: 'Path to the SQLite3 database file',
        type: 'string',
        default: 'wideworlds.sqlite3',
      })
          .option('signProp', {
            alias: 's',
            description: 'Name of the prop to look for in the DB',
            type: 'string',
            default: 'panneau2.rwx',
          })
          .option('userId', {
            alias: 'u',
            description: 'ID of the user owning the prop in the DB',
            type: 'integer',
            default: 4,
          })
          .help()
          .alias('help', 'h');
    }).argv;

const users = new Map();

createConnection({
  type: 'sqlite',
  database: argv.sql,
  synchronize: true,
}).then(async (connection) => {
  const pname = argv.signProp;
  const uid = argv.userId;

  await connection.manager.createQueryBuilder().select('prop.description')
      .from('prop')
      .where('prop.userId = :uid', {uid})
      .andWhere('prop.name = :pname', {pname})
      .getRawMany().then((entries) => {
        entries.map(({description}) => description).forEach((description) => {
          const line = description.replaceAll('\r\n', '\n')
              .replaceAll('\n', ' ').trim();

          // Extract the username and the associated citizen ID from the
          // description when possible
          const m =
              line.match(/^(Chez +)?([A-Za-z0-9_\-]+) +[^\d]*(\d+)[^\d]*$/i);
          if (m) users.set(parseInt(m[3]), m[2]);
        });
      });

  // TODO: Optimize bulk update if possible
  users.forEach((name, id) => {
    connection.manager.createQueryBuilder().update('user').set({name})
        .where('user.id = :id', {id})
        .execute();
  });
}).catch((err) => {
  console.log(err);
  exit(1);
});
