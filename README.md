# sACN2Video2
2nd major release of sACN2Video (complete rewrite)

Renders Images, Videos, etc. controlled by sACN data onto a DLP projector.
Special transformation functions to match the projection surface's geomety are included (corner pin transformation and overlay image).

**documentation not finished yet**

If you want to use it, feel free to ask everything.

## How does it work ?

- All the images and videos are rendered onto a virtual canvas.
- The intensity/opacity, playback and position can be controlled via sACN
- The generated content is transformed with a corner pin transformation (this allows you to move every corner independently)
- Additionally an overlay can be applied to the content (called shutter). The white areas in the overlay image are indicating the areas, the output will be colored, all other areas will be black.
- The result is displayed as a website (using WebGL) or as a native (electron.js) window.

## Features

- sACN: 8 & 16bit, merging, priority
- all configuration data (including all assets) is stored in one file (using a SQLite database). You can simply backup and share it.
- GUI editor is included, but it is possible to edit the configuation directly [reference](/docs/config.md)
- syncronisation with eos timecode for easy programming

## Use cases

background for ...
- theatre productions
- art projects
- shows of any type

**``>>Contribution welcome<<``**

## usefull links

- [db schema](/server/dbSchema.sql)
- [configuration database docs](/docs/config.md)


(c) 2022 Hans Schallmoser - published under the terms of GPL-v3 (see LICENSE file)
