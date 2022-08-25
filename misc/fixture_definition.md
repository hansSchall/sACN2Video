# Fixture definitions

> Fixture definitions for ETC eos can be found in [/misc/sACN2video fixtures.esf3d](misc/sACN2video_fixtures.esf3d)
>
> To use them in your own showfile: Go to `File > Merge`. Select `sACN2Video fixtures.esf2`. Select ONLY (!) `Fixtures`. Click `Merge`.
>
> To create your own fixtures with playback simply copy the `Playback` fixture and add your own properties. Notice: there is a special property called `Audio Volume` you can use.

I recommend the following fixture definitions:

## Audio

1. Playback (see at bottom of page)
2. Volume

## Video

1. Opacity (intensity)
2. Playback
3. Volume

## Image

patch it as a dimmer

## Playback

Simply create Ranges for the property:

|from| to | description |
|----|----|-------------|
| 10 | 19 | pause       |
| 20 | 29 | play        |
| 30 | 39 | play start  |
| 40 | 49 | loop        |
| 50 | 59 | loop start  |
