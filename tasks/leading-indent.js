/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This plugin is meant to check that your files have consistent leading whitespace,
 * either all tabs or all spaces. Nothing more than that.
 * It doesn't check if the spaces are well aligned, nor if there are no mixed leading spaces.
 *
 * For detection of mixed leading spaces in JS you can use JSHint. JSHint's "indent" config
 * options is the way to go to specify exact indentation size (though it's not compatible with
 * some JS formatters).
 *
 * Also it doesn't check for trailing whitespace, because there's such an option in JSHint.
 */

"use strict";

var path = require("path");
var fs = require("fs");

var normalizeConfig = function (indentation) {
    if(indentation !== "tabs" && indentation !== "spaces") {
        indentation = "spaces";
    }
    return indentation;
};

var opposite = function (indentation) {
    if (indentation === "spaces") {
        return "tabs";
    } else if (indentation === "tabs") {
        return "spaces";
    }
};

var hasLeadingTabs = function (filename) {
    var fileContent = fs.readFileSync(filename, 'utf8');
    return (/^\t|\n\t/).test(fileContent);
};

var hasLeadingSpaces = function (filename) {
    var fileContent = fs.readFileSync(filename, 'utf8');
    return (/^[ ]|\n[ ]/).test(fileContent);
};

var hasWrongIndentation = null;

var processPath = function (path, erroredFiles) {
    var isFile = !fs.statSync(path).isDirectory();
    if (isFile && hasWrongIndentation(path)) {
        erroredFiles.push(path);
    }
};

module.exports = function (grunt) {

    grunt.registerMultiTask('leadingIndent', 'Checks that files do not have leading tabs / spaces.', function () {
        var options = this.options({
          indentation: 'spaces'
        });
        var indentation = options.indentation;
        grunt.log.write(('Checking files indentation. Desired indentation: ' + indentation).cyan);
        hasWrongIndentation = (indentation === "spaces") ? hasLeadingTabs : hasLeadingSpaces;

        var files = this.filesSrc;
        grunt.log.writeln(' ('.cyan + ('' + files.length).yellow + (' files)').cyan);
        grunt.verbose.writeln(files.join("\n"));

        if (files.length > 0) {
            var erroredFiles = []; // buffer errors to have all of them displayed instead of the first only
            files.forEach(function (path) {
                processPath(path, erroredFiles);
            });
            if (erroredFiles.length) {
                grunt.log.error(("The following files have leading " + opposite(indentation) + ":").bold.red);
                erroredFiles.forEach(function (path) {
                    grunt.log.error(" " + path.red);
                });
                grunt.warn('Formatting checking failed.'.bold.red);
            }
        } else {
            grunt.log.warn('No input file to check.');
        }

        // Fail task if errors were logged.
        if (this.errorCount) {
            return false;
        }

        // Otherwise, print a success message
        grunt.log.ok();
    });
};
