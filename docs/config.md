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

## propMapping table

> this is currently in beta state, behavior may change in some special cases, but for simple mappings like shown in the example this feature is stable

`CREATE TABLE propMapping (el text, prop text, input text, output text, version integer)`

stores the properties of all the elements

| column | type | description |
| ------ | ---- | ----------- |
| el | TEXT | references to the element (same as in elProps)
| prop | TEXT | property name (same as in elProps)
| input | TEXT | comma seperated list of input mapping (see note below)
| output | TEXT | comma seperated list of output mapping (see note below)
| version | INTEGER | version of valueMapping

Note: The input and output lists together describe a table defining the value mapping.

a record like this `input: 0,255 output: 0,360` maps sacn values to an angle in degrees.

If you have doubts how to use this, take a look at `client/core/valueMapping.ts` to learn, which result is achived in special cases.

`>>improvements welcome<<`

## the valueType concept

This simplifies the configuration a lot, beause some properties may be either controlled by sACN or be set to a fixed value (the position of an element is a good example).

The string in the 'valueType' column controlls how the 'value' column is interpreted

A short overview

| valueType | description |
| --------- | ----------- |
| `static` | the value will be exactly as it is. If it cannot be converted to number it will be used as string
| `staticcp` | short for 'static clipspace' eg. the interval `-1 to 1` is converted to `0 to 1`. See note below.
| `staticpcp` | short for 'static percentage clipspace' eg. the interval `-10 to 100` is converted to `0 to 1`. See note below.
| `sacn` | the property is controlled via sACN (adress format see below). Per default this is mapped to `0 to 1`. The input for valueMapping is raw (`0 to 255(8b) / 65535(16b)`);

All mapping functions above are overwritten by a custom valueMapping

## sACN adress format

there are four ways to declare the sACN adress and universe:

`addr` (8b), `universe/addr` (8b), `universe/addrlow/addrhigh` (16b), `universelow/addrlow/universehigh/addrhi` (16b)

instead if the `'/'` you can also use `','`,`'.'`,`'\'`,`'+'`

## config_universes table

`CREATE TABLE config_universes (universe NUMBER)`

this defines the sACN universes the server should listen to

Note: to apply changes you need to restart the whole server, not only the client

## element types and their properties

| propery and aliases | applies to | data type | description |
| ------------------- | ---------- | --------- | ----------- |
| src | `img`, `video`, `audio` | string | the element's source; may only be `static` type; this references to the `id` column of the `assets` table
| intens, intensity, i | `img`, `video` | float | the opacity of the element, note for `static`: it must be in the range of `0 - 1`
| playback, pb | `video`, `audio` | int / string | see playback note below
| vol | `video`, `audio` | float (0 - 1) | audio volume
| sync | `video`, `audio` | int | refers to the eos timecode list, the video or audio should sync to (see also: note on sync)
| x | `img`, `video` | float | the element's x position (0 = left, 1 = right)
| y | `img`, `video` | float | the element's y position (0 = top, 1 = bottom)
| w | `img`, `video` | float | the element's width (1 = as wide as the viewport)
| h | `img`, `video` | float | the element's height (1 = as high as the viewport)
| re | `img`, `video` | float | element rotation (in degrees)
| rt | `img`, `video` | float | texture rotation (in degrees)
| TLX | `root` | float | x position of the top left corner of the virtual canvas
| TLY | `root` | float | y position of the top left corner of the virtual canvas
| TRX | `root` | float | x position of the top right corner of the virtual canvas
| TRY | `root` | float | y position of the top right corner of the virtual canvas
| BLX | `root` | float | x position of the bottom left corner of the virtual canvas
| BLY | `root` | float | y position of the bottom left corner of the virtual canvas
| BRX | `root` | float | x position of the bottom right corner of the virtual canvas
| BRY | `root` | float | y position of the bottom right corner of the virtual canvas
| mask | `root` | string | works like `src` for the masking image
| fbH | `root` | int | height of framebuffer in px
| fbW | `root` | int | width of framebuffer in px

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
