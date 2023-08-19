# WideWorlds utilities for Le Village 3D

Set of utilities to work on WideWorlds data for Le Village 3D (former Active Worlds universe)

## Tools

Before being able to use any of the scripts: install the dependencies first.

```bash
npm i
```

### signs2usernames.js

```bash
Load WideWorlds sqlite3 database to find sign props holding user names and their
 respective IDs, then update all the found user entries with those names

Positionals:
  sql  Path to the SQLite3 database file[string] [default: "wideworlds.sqlite3"]

Options:
  -h, --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -s, --signProp  Name of the prop to look for in the DB
                                              [string] [default: "panneau2.rwx"]
  -u, --userId    ID of the user owning the prop in the DB          [default: 4]
```

Usage example: `./signs2usernames.js ../WideWorlds/wideworlds.sqlite3 --userId 4 --signProp panneau2.rwx`