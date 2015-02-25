# Amazing Subtitle Burn-in-ator (for Mac)

Oh my. This provides a friendly Mac GUI interface for burning in subtitles to videos using ffmpeg. Requires Mac OS Mavericks or higher, I think. ffmpeg can accept a very wide range of video types, which is very useful. It's recommended that you save the output as an mp4 as ffmpeg is set to use H264/AAC as the output codecs.

This was built to solve the problem of not-super-tech instructional technologists being faced with the annoying difficult task of burning subtitles into a video. It's insane that we don't have a friendly, free GUI for this simple task. So I built one. It's a bit janky and hacky, but it works.

`index.html` is the main interface; `app.js` is the main application code. Check 'em out.

## usage

Quick start: download it [here](http://cylesoft.com/downloads/subtitle-burninator.zip) and unzip it, and open up `run-me` !

More advanced:

1. Clone the repo somewhere.
2. Download nw.js here: http://nwjs.io/ and download the "OSX64" version.
3. Unzip it, put it in the same folder as the code you just cloned.
4. Download ffmpeg built for OS X here: http://evermeet.cx/ffmpeg/ (2.5.3 was used in development)
5. Side note: you may need something like [The Unarchiver](https://itunes.apple.com/us/app/the-unarchiver/id425424353?mt=12) to do the next step.
6. Unzip the ffmpeg 7-zip file, put the resulting `ffmpeg` file in the same folder as the code you just cloned.
7. In the folder with all the code and ffmpeg and nwjs, run `nwjs` ! That's it.

## dependency versions

- `nw.js` 0.12.0-alpha3
- `ffmpeg` 2.5.3 (static binary for Mac OS X)

## notes

nw.js: http://nwjs.io/

ffmpeg static binaries for mac: http://evermeet.cx/ffmpeg/

Example command being used:

`./ffmpeg -y -i input.mp4 -vf subtitles=input.srt -c:v libx264 -c:a libvo_aacenc -preset slow -crf 10 output-burnt.mp4`

On Windows compatibility:

You could probably use this on Windows also, by modifying some of the code and using the ffmpeg binary for Windows.