# sACN2Video

![Contribution welcome](https://img.shields.io/badge/contribution-welcome-green?style=for-the-badge)
![License](https://img.shields.io/github/license/hansschall/sacn2video?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/hansSchall/sacn2video?logo=typescript&style=for-the-badge)

Renders Images, Videos, etc. controlled by sACN data onto a video projector.
Special transformation functions to match the projection surface's geomety are included (corner pin
transformation and overlay image).

If you have questions how to use it, feel free to ask everything. [Create a discussion with the
`how to use/configure/...` label.](https://github.com/hansSchall/sACN2Video/discussions/new?category=how-to-use-configure)

## How does the software work?

- All the images and videos are rendered onto a virtual canvas.
- The intensity/opacity, playback and position can be controlled via sACN
- The generated content is transformed with a corner pin transformation (this allows you to move
every corner independently)
- Additionally a masking overlay can be applied to the content. The white areas in the mask image
are indicating the areas, the output will be colored, all other areas will be black.
- The result is displayed as a website (using WebGL) or as a native (electron.js) window.

## Features

- sACN: 8 & 16bit, merging, priority, value mapping
- all configuration data (including all assets) is stored in one file (using a SQLite database).
You can simply backup and share it.
- GUI editor is included, but it is possible to edit the configuation directly, [reference](/docs/config.md)
- syncronisation with etc eos timecode for easy programming

## Use cases

background (and foreground too ;-) ) for ...
- theatre productions
- art projects
- shows of any type

## Installation

see [docs/installation_and_running.md](docs/installation_and_running.md)

## FAQ / common questions

### Why is this sometimes called sACN2Video2?

The current codebase is a complete rewrite of the first version with completely independent
versioning, code and so on. A long time during development there were two repositories
(hansSchall/sACN2Video old version and hansSchall/sACN2Video2 new version). The renaming of
all mentions is still in progress.

### How to control the software with a light console?

As the name implies the software is mainly controlled by sACN. So the answer is: Turn
on sACN at your console and patch the channels exactly as you have defined them in the
configuration editor. This is the same as connecting a DMX device - except that you
don't need XLR cables ;-) . More details on patching can be found [here](/misc/fixture_definition.md).

## Error: Cannot find module 'C:\hans\ts\sACN2Video\server\node_modules\sacn\dist'. Please verify that the package.json has a valid "main" entry

If this message shows up when trying to start the server, run `npm run build` in `server/node_modules/sacn`

### You have questions or suggestions?

[Questions: Create a discussion with the `how to use/configure/...` label.](https://github.com/hansSchall/sACN2Video/discussions/new?category=how-to-use-configure)

Suggestions: Create a discussion or an issue.

## usefull links

- [fixture definitions](/misc/fixture_definition.md)
- [configuration database docs](/docs/config.md)


(c) 2022 Hans Schallmoser - published under the terms of GPL-v3 (see LICENSE file, the
licenses of the libaries used can be found in their own folders in the node_modules folders,
libaries directly copieed into the code have their license notice directly next to them)
