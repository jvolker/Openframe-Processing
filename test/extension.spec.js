var assert = require('assert'),
    exec = require('child_process').exec,
    fs = require('fs'),
    Extension = require('openframe-extension'),
    ProcessingExtension = require('../extension')

describe('instantiation', function() {
    it('should be an instance of type Extension', function() {
        assert(ProcessingExtension instanceof Extension)
    })
})

describe('properties', function() {
    it('should include all required format properties', function() {
        var format = ProcessingExtension.props.format

        assert(format.name)
        assert(typeof format.name === 'string')

        assert(format.display_name)
        assert(typeof format.display_name === 'string')

        assert(format.download !== undefined)
        assert(typeof format.download === 'boolean')

        assert(format.start_command)
        assert(typeof format.start_command === 'string' || typeof format.start_command === 'function')
        //
        // if (typeof format.start_command === 'function') {
        //     assert(typeof format.start_command({}, {
        //         $url: 'https://raw.githubusercontent.com/processing/processing-docs/master/content/examples/Topics/Motion/Morph/Morph.pde',
        //         $id: '5d8540b3a38167076035bd5c',
        //         $filepath: '/tmp/5d8540b3a38167076035bd5cMorph.pde',
        //         $filename: 'Morph.pde'
        //
        //     }) === 'string')
        // }

        assert(format.end_command)
        assert(typeof format.end_command === 'string')
    })
})


