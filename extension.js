var pjson = require('./package.json'),
    debug = require('debug')('openframe:processing'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync,
    fs = require('fs-extra'),
    path = require('path'),
    DecompressZip = require('decompress-zip'),
    replace = require('replace-in-file'),
    os = require('os'),
    psList = require('ps-list');

let tmpDir = '/tmp/'
// TODO: the preferences are stored in different path on each OS. This currently only works on the Pi
let pathToProcessingPreferencesTxt = path.join(os.homedir(),'.processing/preferences.txt')

/**
 *
 * xinit template and token replacement code borrowed from Openframe-Website extension
 *
 *
 *
 * Extension initialization method.
 *
 * Called when the extension (and its dependencies) have been installed.
 *
 * @param  {object} OF An interface provided to extensions giving limited access to the frame environment
 */

module.exports = new Extension({
    format: {
        // the name should be the same as the package name
        'name': pjson.name,
        // this is what might get displayed to users
        'display_name': 'Processing (pde)',
        'download': true,
        'start_command': function(options, tokens) {
            var thisExtension = this
            return new Promise(function(resolve, reject) {
              // is X server running?
              psList().then(function(processes) {
                    processes = processes.filter(function(process) { process.name.indexOf('Xorg') > -1; });
                    let commandLineMode = processes.length > 0;

                    // parse options from args into tokens
                    let _tokens = _extendTokens(args, tokens);
                    
                    prepareSketch(options, tokens).then(function(result) {
                        tokens['$tmpSketchPath'] = result

                        // 1. clone template .xinitrc
                        debug('clone template')
                        var filePath = _cloneTemplate(thisExtension.xinitrcTplPath)
                        // 2. parse options from options into tokens
                        debug('extend tokens')
                        var _tokens = _extendTokens(options, tokens)
                        // 3. replace tokens in .xinitrc
                        debug('replace tokens')
                        _replaceTokens(filePath, _tokens)
                        // 4. return xinit
                        debug('build command')
                        
                        // command line mode
                        if (commandLineMode) {
                          var command = 'xinit ' + filePath
                          // console.log(command)
                          return resolve(command)
                        }
                        // desktop mode
                        else {
                          
                            // var command = '/usr/bin/chromium --noerrdialogs --kiosk --incognito $flags "$url"'
                            var command = '/usr/local/bin/processing-java --present '
                             // _tokens['$flags'].forEach(function(flag, index) {
                             //   command += '--' + flag + ' ';              
                             // })
                            command += '--sketch=' + _tokens['$tmpSketchPath']
                            // console.log(command)
                            return resolve(command);
                        }        
                    })
              });        
            })
        },
        // how do we stop this type of artwork?
        // 'end_command': 'pkill -f X && pkill -f java',
        'end_command': 'pkill -f java',
        // function () {
        //   // cleanUp()
        //   console.log(end_command)
        //
        //   return 'pkill -f X'
        // },
        xinitrcTplPath: __dirname + '/scripts/.xinitrc.tpl'
    }
})


function prepareSketch(_options, _tokens) {
    return new Promise(function(resolve, reject) {

        let filename = _tokens.$filename,
            filepath = _tokens.$filepath, // downloaded file
            extension = path.extname(filename),
            filebasename = path.basename(filename, extension),
            tmpSketchPath = path.join(tmpDir, filebasename)

    // debug(filename)
    // debug(filepath)
    // debug(extension)
    // debug(filebasename)
    // debug(tmpSketchPath)

        if (extension === '.pde') {
            debug('copy sketch to parent folder')

            fs.mkdirp(tmpSketchPath)
            fs.copySync(filepath, path.join(tmpSketchPath,filename))
            preprocessCode()
        }
        else if (extension === '.zip') {
            debug('unzip sketch')

            var unzipper = new DecompressZip(filepath)

            unzipper.on('error', function(err) {
                console.log('Caught an error')
            })

            unzipper.on('extract', function(log) {
                debug('Finished extracting')

        //in case it is wrapped by a folder: unwrap it
                let wrappedPath = path.join(tmpSketchPath,filebasename)
                let unwrappedPathTmp = tmpSketchPath + 'tmp'
                if (fs.existsSync(wrappedPath) && fs.lstatSync(wrappedPath).isDirectory()) {
                    debug('wrapped directory exists > move files')
                    fs.copySync(wrappedPath, tmpSketchPath) // TODO: clean up. use move instead of copy. move hase issues so far.
                }
                preprocessCode()
            })

            unzipper.on('progress', function(fileIndex, fileCount) {
                debug('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
            })

            unzipper.extract({
                path: tmpSketchPath,
        // filter: function (file) {
        //     return file.type !== "SymbolicLink";
        // }
            })

        }
    else console.log('Unknown file format: ' + extension)

        function preprocessCode() {
      // TODO: find and use main PDE file in ZIP package that has setup() and draw() regardless of the ZIP files name
            let pathToMainFile = path.join(tmpSketchPath,filebasename + '.pde')
      // TODO: This changes the processing settings permanently. Use command line arguments instead, once this is solved: https://github.com/processing/processing/issues/5921
            hideBackground()
            if (typeof _options.fullscreen === 'undefined' || _options.fullscreen) fullScreen(pathToMainFile)

            resolve(tmpSketchPath)
        }
    })
}

function cleanUp() {
    fs.readdir(tmpDir, (err, files) => {
        files.forEach(file => {
            debug(file)
        })
    })
}

function fullScreen(pathToMainFile) {

    let data = `  
    @Override
    public void size(int width, int height) {
      fullScreen();
    }

    @Override
    public void size(int width, int height, String renderer) {
      fullScreen(renderer);
    }`

    fs.appendFileSync(pathToMainFile, data, 'utf8')
}

function hideBackground() {
    debug('hideBackground')

  // change color of background and stop button to black
    var results = replace.sync({
        files: pathToProcessingPreferencesTxt,
        from: [/(run.present.bgcolor=)(.*)/g , /(run.present.stop.color=)(.*)/g],
        to: '$1#000000',
    // dry: true
    })

  // debug(results);
}


/**
 * extend the tokens with expected values from options
 *
 * @param {object} options Arguments provided to this extension
 * @param {object} tokens Original tokens for this extension
 */
function _extendTokens(options, tokens) {
    var _tokens = {},
        _options = options,
        expectedKeys = ['flags']

    // if options is not an object, we'll just use an empty one
    if (typeof(options) !== 'object') {
        _options = {}
    }

    // shallow-copy the original tokens object
    for (let key in tokens) {
        _tokens[key] = tokens[key]
    }

    // copy expected arguments from options to the new tokens object
    // defaulting to an emptystring
    for (let key of expectedKeys) {
        // prepend keys with a dollar-sign for template-replacement
        _tokens['$'+key] = _options[key] || ''
    }

    return _tokens
}

/**
 * Replace tokens in a file.
 *
 * @param  {string} _str
 * @param  {object} tokens
 * @return {string} The string with tokens replaced.
 */
function _replaceTokens(filePath, tokens) {
    debug(_replaceTokens, filePath, tokens)

    function replace(token, value) {
        // tokens start with a $ which needs to be escaped, oops
        var _token = '\\' + token,
            // any '&' character needs to be escaped in the value,
            //  otherwise it is used as a backreference
            _value = value.replace(/&/g, '\\&'),
            // use commas as delims so that we don't need to escape value, which might be a URL
            cmd = 'sed -i "s,' + _token + ',' + _value + ',g" ' + filePath
        execSync(cmd)
    }

    var key
    for (key in tokens) {
        // TODO: better token replacement (global replacement?
        replace(key, tokens[key])
    }
}

/**
 * Clone xinitrc
 *
 * @return {string} The string with tokens replaced.
 */
function _cloneTemplate(filePath) {
    var newFilePath = filePath.replace('.tpl', ''),
        cmd = 'cp -f ' + filePath + ' ' + newFilePath

    execSync(cmd)

    return newFilePath
}


