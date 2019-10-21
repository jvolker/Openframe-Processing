
# Openframe Processing extension

This extension runs interactive [Processing](http://processing.org) sketches on a [Raspberry Pi](https://www.raspberrypi.org/) within [Openframe](http://openframe.io) – "an open source platform for artists, curators and art enthusiasts to share, discover and display digital art". 

## Installation

### Prerequisites

- version `1.x.x` of `openframe-processing` works with `openframe` version `0.4.9`. Follow this guide: http://docs.openframe.io/frame-setup-guide/#4-extensions
- version `2.x.x` of `openframe-processing` currently requires a dev version of `openframe`. Follow the Readme: https://github.com/jvolker/Openframe
    -  Version  2.x.x adds support  for `.zip` files with contributed libraries. In earlier versions `.zip` are considered experimental as full extraction of the package is not guaranteed when the sketch is run.

### Instructions

Then, enter via the command line: `openframe -i openframe-processing`

This extension is based on `processing-java`. When Processing artwork is selected in the web app, the artwork gets downloaded to the Raspberry Pi where it's going to be compiled and run.


## Artwork

### How to upload artwork?

First, follow the Openframe guide on how to set up an Openframe and to display artwork: http://docs.openframe.io/frame-setup-guide/

Then, in the [web app](https://openframe.io/stream)  
1. Click `Add Artwork`
2. Make sure you give your artwork a title 
3. Use `openframe-processing` as artwork format
4. Enter the URL to your artwork into the field `URL where the artwork is hosted`. So far it supports URLs to either a single `.pde` or a `.zip` file containing multiple `.pde` files and/or Processing libraries.
 If you package your sketch using ZIP make sure the `.zip` file is named the same as the sketch.
5. Optionally enter a URL to a preview image of the sketch which is especially useful if you like to publish your artwork.
6. Select the artwork by clicking the `push to frame` button

### Processing libraries

You can ship contributed Processing and Java libraries with your artwork package in a `.zip` file. All libraries (usually `.jar` files) have to be in a `code` folder within your artwork package. More info here: https://discourse.processing.org/t/how-to-distribute-sketches-with-libraries-to-openframe/14095/9?u=jvolker This thread also discusses a convenience install script of most common Processing libraries which might be added in the future.


### Fullscreen

The extension loads all sketches in fullscreen by default. For some sketches this might not be useful. To disable fullscreen, add the following to the `options` property of the artwork in the database: 

```
{
  "fullscreen": false
}
```

The Openframe web app currently doesn't support this. But it's possible with the [API explorer](https://api.openframe.io/explorer/).

### Where to host artwork?

Currently, you have to upload your artwork to a publicly reachable webspace. If you don't have a webspace/server you could, as one out of many options, try Dropbox. Once it's uploaded to Dropbox, use the `Copy Dropbox Link`. You will end up with a URL like this `https://www.dropbox.com/s/vb17ehsdfqp2bjd/290317.jpg?dl=0`. Change the 0 at the end to 1 like this `https://www.dropbox.com/s/vb17ehsdfqp2bjd/290317.jpg?dl=1`, and you will be able to use the URL for Openframe.

## Todo

- hide cursor at all times (even when the mouse is moved)
- support for precompiled sketches
- add unit tests

## Thanks

Thanks to Jonathan Wohl and Isaac Bertran for this amazing project

*Author*
[Jeremias Volker](http://www.jeremiasvolker.com)  
Twitter (@jeremiasvolker)(http://twitter.com/jeremiasvolker)

*Initiator* 
[karlosgliberal](http://labs.interzonas.info)  
Twitter (@patxangas)(http://twitter.com/patxangas)