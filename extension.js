var pjson = require('./package.json'),
    debug = require('debug')('openframe:processing'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync,
    fs = require('fs-extra'),
    path = require('path'),
    unzip = require('unzip'),
    sync = require('synchronize');

let tmpDir = '/tmp/';

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
        // does this type of artwork need to be downloaded to the frame?
        'download': true,
        // how do start this type of artwork? currently two token replacements, $filepath and $url
        'start_command': function(args, tokens) {

            tokens['$tmpSketchPath'] = prepareSketch(tokens);

          // 1. clone template .xinitrc
            var filePath = _cloneTemplate(this.xinitrcTplPath),
          // 2. parse options from args into tokens
                _tokens = _extendTokens(args, tokens);
          // 3. replace tokens in .xinitrc
            _replaceTokens(filePath, _tokens);
          // 4. return xinit
            var command = 'xinit ' + filePath;
          // console.log(command)

            return command;
        },
        // how do we stop this type of artwork?
        'end_command': 'pkill -f X',
        // function () {
        //   // cleanUp()
        //   console.log(end_command)
        //
        //   return 'pkill -f X'
        // },
        xinitrcTplPath: __dirname + '/scripts/.xinitrc.tpl'
    }
});


function prepareSketch(_settings) {
    let filename = _settings.$filename,
        filepath = _settings.$filepath, // downloaded file
        extension = path.extname(filename),
        filebasename = path.basename(filename, extension),
        tmpSketchPath = path.join(tmpDir, filebasename);

    // debug(filename)
    // debug(filepath)
    // debug(extension)
    // debug(filebasename)
    // debug(tmpSketchPath)

    if (extension == '.pde') {
        debug('copy sketch to parent folder');

        fs.mkdirp(tmpSketchPath);
        fs.copySync(filepath, path.join(tmpSketchPath,filename));
    }
    else if (extension == '.zip') {
        debug('unzip sketch');

        sync.fiber(function() {
            data = sync.await(
          fs.createReadStream(filepath)
          .pipe(unzip.Extract({path: tmpSketchPath}))
          .on('finish', sync.defer())
        );
        });

      //in case it is wrapped by a folder: unwrap it
        let wrappedPath = path.join(tmpSketchPath,filebasename);
        let unwrappedPathTmp = tmpSketchPath + 'tmp';
        if (fs.existsSync(wrappedPath) && fs.lstatSync(wrappedPath).isDirectory()) {
            debug('wrapped directory exists > move files');
            fs.copySync(wrappedPath, tmpSketchPath); // TODO: clean up. use move instead of copy. move hase issues so far.
        }
    }
    else debug('Unknown file format: ' + extension);
    
    let pathToMainFile = path.join(tmpSketchPath,filebasename + '.pde')
    // debug(pathToMainFile)
    // fullScreen(pathToMainFile)

    return tmpSketchPath;
}

// function cleanUp() {
//   fs.readdir(tmpDir, (err, files) => {
//     files.forEach(file => {
//       console.log(file)
//     })
//   })
// }


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
  
  fs.appendFileSync(pathToMainFile, data, 'utf8');
}



/**
 * extend the tokens with expected values from args
 *
 * @param {object} args Arguments provided to this extension
 * @param {object} tokens Original tokens for this extension
 */
function _extendTokens(args, tokens) {
    var _tokens = {},
        _args = args,
        expectedKeys = ['flags'];

    // if args is not an object, we'll just use an empty one
    if (typeof(args) !== 'object') {
        _args = {};
    }

    // shallow-copy the original tokens object
    for (let key in tokens) {
        _tokens[key] = tokens[key];
    }

    // copy expected arguments from args to the new tokens object
    // defaulting to an emptystring
    for (let key of expectedKeys) {
        // prepend keys with a dollar-sign for template-replacement
        _tokens['$'+key] = _args[key] || '';
    }

    return _tokens;
}

/**
 * Replace tokens in a file.
 *
 * @param  {string} _str
 * @param  {object} tokens
 * @return {string} The string with tokens replaced.
 */
function _replaceTokens(filePath, tokens) {
    debug(_replaceTokens, filePath, tokens);

    function replace(token, value) {
        // tokens start with a $ which needs to be escaped, oops
        var _token = '\\' + token,
            // any '&' character needs to be escaped in the value,
            //  otherwise it is used as a backreference
            _value = value.replace(/&/g, '\\&'),
            // use commas as delims so that we don't need to escape value, which might be a URL
            cmd = 'sed -i "s,' + _token + ',' + _value + ',g" ' + filePath;
        execSync(cmd);
    }

    var key;
    for (key in tokens) {
        // TODO: better token replacement (global replacement?
        replace(key, tokens[key]);
    }
}

/**
 * Clone xinitrc
 *
 * @return {string} The string with tokens replaced.
 */
function _cloneTemplate(filePath) {
    var newFilePath = filePath.replace('.tpl', ''),
        cmd = 'cp -f ' + filePath + ' ' + newFilePath;

    execSync(cmd);

    return newFilePath;
}


