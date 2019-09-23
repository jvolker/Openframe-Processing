# Openframe Processing extension

*Author* 
[karlosgliberal](http://labs.interzonas.info)
Twitter (@patxangas)(http://twitter.com/patxangas)

*Contributor*
[Jeremias Volker](http://www.jeremiasvolker.com)

This extension runs interactive [Processing](http://processing.org) sketches on a [Raspberry Pi](https://www.raspberrypi.org/) within [Openframe](http://openframe.io) – "an open source platform for artists, curators and art enthusiasts to share, discover and display digital art". 


## Installation

First follow this guide: http://docs.openframe.io/frame-setup-guide/#4-extensions

Then, enter via the command line: `openframe -i openframe-processing`

This extension is based on `processing-java`. When Processing artwork is selected in the web app, the artwork gets downloaded to the Raspberry Pi where it's going to be compiled and run.

## How to upload Processing artwork?

First, follow the Openframe guide on how to set up an Openframe and to display artwork: http://docs.openframe.io/frame-setup-guide/

Then, in the [web app](https://openframe.io/stream)  
1. Click `Add Artwork`
2. Make sure you give your artwork a title 
3. Use `openframe-processing` as artwork format
4. Enter the URL to your artwork into the field `URL where the artwork is hosted`. So far it supports URLs to PDE or ZIP files with packaged sketches. If you package your sketch using ZIP make sure the ZIP file is named the same as the sketch.
5. Optionally enter a URL to a preview image of the sketch which is especially useful if you like to publish your artwork.
6. Select the artwork by clicking the `push to frame` button

## Where to host artwork?

Currently, you have to upload your artwork to a publicly reachable webspace. If you don't have a webspace/server you could, as one out of many options, try Dropbox. Once it's uploaded to Dropbox, use the `Copy Dropbox Link`. You will end up with a URL like this `https://www.dropbox.com/s/vb17ehsdfqp2bjd/290317.jpg?dl=0`. Change the 0 at the end to 1 like this `https://www.dropbox.com/s/vb17ehsdfqp2bjd/290317.jpg?dl=1`, and you will be able to use the URL for Openframe.

## Todo

- optional fullscreen
- hide cursor at all times
- change the background and stop button colour to black
- support for contributed libraries
- support for precompiled sketches
- add unit tests
- automatically find and use main PDE file in ZIP package that has setup() and draw() regardless of the ZIP files name

## Thanks

Thanks to Jonathan Wohl and Isaac Bertran for this amazing project
