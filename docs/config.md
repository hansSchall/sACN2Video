# configuration database reference

## assets table

`CREATE TABLE assets (id TEXT PRIMARY KEY, data BLOB, mime TEXT, size NUMBER, label TEXT, changeId TEXT)`

stores all media content (images, videos, etc.)

| column | type | description |
| ------ | ---- | ----------- |
| id | TEXT | identifing the asset, for example 'testscreen', 'image1'
| data | BLOB | content of the file
| mime | TEXT | for example 'image/jpg', 'video/ogg'
| size | NUMBER | length of the file in bytes
| label | TEXT | optional
| changeId | TEXT | auto generated uuid, changes at every change to data, enables HTTP Caching


## els table

`CREATE TABLE els (id TEXT PRIMARY KEY,type TEXT,enabled NUMBER DEFAULT 1, zi FLOAT DEFAULT 0)`

stores a list of all the elements, which should be visible

| column | type | description |
| ------ | ---- | ----------- |
| id | TEXT | identifieing the element |
| type | TEXT | 'img' / 'video' / 'audio' / 'root' (see note below) |
| enabled | NUMBER | 0 = disabled, 1 = enabled, more options in future use |
| zi | FLOAT | works like css z-index, controlls the order of the elements |


Note: 'root' is a special type of element.
There may be only one element of this type.
This element has special properies, controlling the viewport and general rendering options

## elprops table

`CREATE TABLE elprops (el TEXT, prop TEXT, valueType TEXT, value TEXT)`

stores the properties of all the elements

| column | type | description |
| ------ | ---- | ----------- |
| el | TEXT | references to the element
| prop | TEXT | property name
| valueType | TEXT | type of the value (see below)
| value | TEXT | if (valueType == "static") this will be the value otherwise this extends the valueType

## the valueType concept

This simplifies the configuration a lot, beause some properties may be either controlled by sACN or be set to a fixed value (the position of an element is a good example).

The string in the 'valueType' column controlls how the 'value' column is interpreted

A short overview

| valueType | description |
| --------- | ----------- |
| `static` | the value will be exactly as it is. If it cannot be converted to number it will be used as string
| `staticcp` | short for 'static clipspace' eg. the interval `-1 to 1` is converted to `0 to 1`
| `staticpcp` | short for 'static percentage clipspace' eg. the interval `-10 to 100` is converted to `0 to 1`
| `sacn` | the property is controlled via sACN (adress format see below)

## sACN adress format

there are four ways to declare the sACN adress and universe:

`addr` (8b), `universe/addr` (8b), `universe/addrlow/addrhigh` (16b), `universelow/addrlow/universehigh/addrhi` (16b)

instead if the `'/'` you can also use `','`,`'.'`,`'\'`,`'+'`

## config_universes table

`CREATE TABLE config_universes (universe NUMBER)`

this defines the sACN universes the server should listen to

Note: to apply changes you need to restart the whole server, not only the client

## element types and their properties

| propery and aliases | applies to | description |
| ------------------- | ---------- | ----------- |
| src | `img`, `video`, `audio` | the element's source; may only be `static` type; this references to the `id` column of the `assets` table
| intens, intensity, i | `img`, `video` | the opacity of the element, note for `static`: it must be in the range of `0 - 1`
| playback, pb | `video`, `audio` | see playback note below
| sync | `video`, `audio` | refers to the eos timecode list, the video or audio should sync to (see also: note on sync)
| x | `img`, `video` | the element's x position (0 = left, 1 = right)
| y | `img`, `video` | the element's y position (0 = top, 1 = bottom)
| w | `img`, `video` | the element's width (1 = as wide as the viewport)
| h | `img`, `video` | the element's height (1 = as high as the viewport)
| TLX | `root` | x position of the top left corner of the virtual canvas
| TLY | `root` | y position of the top left corner of the virtual canvas
| TRX | `root` | x position of the top right corner of the virtual canvas
| TRY | `root` | y position of the top right corner of the virtual canvas
| BLX | `root` | x position of the bottom left corner of the virtual canvas
| BLY | `root` | y position of the bottom left corner of the virtual canvas
| BRX | `root` | x position of the bottom right corner of the virtual canvas
| BRY | `root` | y position of the bottom right corner of the virtual canvas
| mask | `root` | works like `src` for the masking image

### note on playback

| dmx value (0-255) | function |
| ----------------- | -------- |
| 0 - 5 | nothing |
| 6 - 15 | pause |
| 16 - 25 | play |
| 26 - 35 | play from the beginning |
| 36 - 45 | loop |
| 46 - 55 | loop from the beginning |

### note on sync

It is possible to sync an etc eos timecode eventlist to an video or audio element.

If enabled, sACN2Video will send OSC commands to eos to start and stop the timecode and sets the current time correctly.
