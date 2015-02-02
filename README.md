grunt-leading-indent
====================

[![Build Status](https://travis-ci.org/jakub-g/grunt-leading-indent.png)](https://travis-ci.org/jakub-g/grunt-leading-indent)

A plugin for Grunt which verifies that files have either all leading tabs or all leading spaces.

Compatible with Grunt 0.4.

## Getting Started
Install this grunt plugin next to your project's `Gruntfile.js` with:

    npm install grunt-leading-indent

Then add this line to your project's `grunt.js` gruntfile:

    grunt.loadNpmTasks('grunt-leading-indent');

## Sample usage

    leadingIndent : {
        options: {
            indentation : "spaces"
        },
        js : ['Gruntfile.js', 'tasks/**/*.js'],
        zero: {
            options: {
                indentation : "spaces",
                failIfNoFiles: true
            },
            src: ['*.does-not-exist']
        }
    }

## License
Copyright (c) 2013 Aria Templates

Licensed under the Apache 2.0 license.

