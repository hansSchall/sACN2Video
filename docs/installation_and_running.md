# Installation

1. install [Node.js](http://nodejs.org).
2. run `npm install -g typescript`, `npm install -g electron` and `npm install -g yarn`.
3. clone this repo.
4. run `yarn install` in these folders: `client`, `server`, `runInNativeWin` and `editor/frontend`. The last two are only needed if you are planing to use the GUI.
5. run `tsc` in the same folders.

# Starting the application

there are two ways:

## CLI

run `node server.js [name of the database file you want to use] [http port]` in `server`.

## GUI

run `electron .` in `runInNativeWin`.

You will be prompted to select a database file. If you select a file, which doesn't exist, it will be created and initialized.

On MS Windows you can also use `run.bat`. All the additional commands in there are needed to ensure electron is started in the correct folder, even if the .bat file is started from a desktop shortcut

Currently large parts of the GUI are in German, but this will change in the future.

Some translations you might need:

| German | English |
| ------ | ------- |
| ... wirklich löschen? | Do you really want to delete ...?
| Bearbeiten | Edit
| Nur Anzeigen | Edit only
| Abbrechen | Cancel
| Öffnen | Open
| Datei | File
| Löschen | Delete

**more information following**
