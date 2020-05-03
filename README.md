
# Openframe Processing extension

This extension runs interactive [Processing](http://processing.org) sketches on a [Raspberry Pi](https://www.raspberrypi.org/) within [Openframe](http://openframe.io) – "an open source platform for artists, curators and art enthusiasts to share, discover and display digital art". 

## Installation

### Prerequisites

Follow the official guide https://docs.openframe.io/#getting-started to install Openframe. 

Since version `2.x.x` of this extension, Openframe `v0.4.12` or higher is required.

### Instructions

Then, enter via the command line: `openframe -i openframe-processing`

This extension is based on `processing-java`. When Processing artwork is selected in the web app, the artwork gets downloaded to the Raspberry Pi where it's going to be compiled and run.


## Artwork

### How to upload artwork?

Follow the [adding artwork section](https://docs.openframe.io/#adding-artwork) of the Openframe docs and use `openframe-processing` as artwork format.

So far it supports URLs (`URL where the artwork is hosted`) to either a single `.pde` or a `.zip` file containing multiple `.pde` files and/or Processing libraries. If you package your sketch using ZIP make sure the `.zip` file is named the same as the sketch.  

### Where to host artwork?

https://docs.openframe.io/#hosting-artwork

### Processing libraries

You can ship contributed Processing and Java libraries with your artwork package in a `.zip` file. All libraries (usually `.jar` files) have to be in a `code` folder within your artwork package. More info here: https://discourse.processing.org/t/how-to-distribute-sketches-with-libraries-to-openframe/14095/9?u=jvolker This thread also discusses a convenience install script of most common Processing libraries which might be added in the future.


### Fullscreen

The extension loads all sketches in fullscreen by default. For some sketches this might not be useful. To disable fullscreen, add the following to the `options` property of the artwork in the database: 

```
{
  "fullscreen": false
}
```

The Openframe web app currently doesn't support this. Alternative ways to do this are [described in the Openframe docs](https://docs.openframe.io/#per-artwork-settings) .


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