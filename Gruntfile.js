module.exports = function (grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            compress: {
                main: {
                    options: {
                        archive: 'build/<%= pkg.name %>.<%= pkg.version %>.tar.gz'
                    },
                    files: [
                        {expand: true, cwd: 'build/', src: ['src/**', '!src/**/*.tmpl'], dest: '.'},
                        {src: ['index.html'], dest: '.'},
                        {src: ['server.js'], dest: '.'},
                        {src: ['package.json'], dest: '.'}
                    ]
                }
            },
            jshint: {
                all: ['Gruntfile.js', 'src/js/modules/**/*.js', 'test/spec/*.js'],
                options: {
                    "curly": true,
                    "eqnull": true,
                    "eqeqeq": true,
                    "undef": true,
                    "strict": true,
                    "globals": {
                        "console": false,
                        "define": false,
                        "require": false,
                        "google": false,
                        "Backbone": false,
                        "location": false,
                        "document": false,
                        "module": false,
                        "window": false,
                        "requirejs": false,
                        "describe": false,
                        "it": false,
                        "expect": false,
                        "beforeEach" : false,
                        "afterEach" : false,
                        "$": false,
                        "_": false
                    }
                }
            },
            connect: {
                server: {
                    options: {
                        port: 8000,
                        base: '.'
                    }
                }
            },
            requirejs: {
                compile: {
                    options: {
                        appDir: ".",
                        baseUrl: "src/js/modules",
                        mainConfigFile: "src/js/modules/app-main.js",
                        dir: "build",
                        optimize: "uglify2",
                        skipDirOptimize: true,
                        fileExclusionRegExp: /^(\.)|(node_modules)|(doc)|(Gruntfile.js)/,
                        inlineText: true,
                        removeCombined: true,
                        modules: [
                            {
                                name: 'app-main'
//                                exclude: [ 'tpl' ]
                            }
                            // ADD MODULES HERE THAT YOU WISH TO OPTIMIZE
                        ]
                    }
                }
            },
            jasmine: {
                taskName: {
                    src: './App.js',
                    options: {
                        specs: 'test/spec/*.spec.js',
//                        helpers: 'spec/*.helper.js',
                        host: 'http://127.0.0.1:<%= connect.server.options.port %>/',
                        keepRunner: true,
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfigFile: 'src/js/modules/app-main.js',
                            requireConfig: {
                                baseUrl: 'src/js/modules'
                            }
                        }
                    }
                }
            },
            bumpup: {
                file: 'package.json'
            },
            tagrelease: {
                file: 'package.json',
                commit: true,
                message: 'Release %version%',
                annotate: true
            },
            bower: {
                target: {
                    rjsConfig: 'src/js/modules/app-main.js'
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-tagrelease');

    grunt.registerTask('default', ['package']);
    grunt.registerTask('test', ['jshint', 'connect', 'jasmine']);

    grunt.registerTask('optimize', ['requirejs']);

    grunt.registerTask('package', ['test', 'optimize', 'compress']);

    grunt.registerTask('deploy', ['']);

    grunt.registerTask('update-package-json', function () {
        grunt.config.set('pkg', grunt.file.readJSON('package.json'));
    });

    grunt.registerTask('bump-version', function (type) {
        if (type === 'snapshot') {
            var filePath = "package.json";
            var file = grunt.file.read(filePath);
            var meta = JSON.parse(file);
            var oldVersion = meta.version;
            var newVersion;
            if (/-SNAPSHOT$/i.test(oldVersion)) {
                newVersion = oldVersion.replace('-SNAPSHOT', '');
            } else {
                newVersion = oldVersion + '-SNAPSHOT';
            }
            meta.version = newVersion;
            // Stringify new metafile and save
            if (!grunt.file.write(filePath, JSON.stringify(meta, null, '\t'))) {
                grunt.fail.warn('Couldn\'t write to "' + filePath + '"');
            }
        } else {
            grunt.task.run('bumpup:' + type);
        }
    });

    // THIS TASK WILL RELEASE THE CURRENT -SNAPSHOT, TAG IT IN GIT, PACKAGE IT, PUSH IT TO THE CDN, AND INCREMENT TO THE NEXT -SNAPSHOT
    grunt.registerTask('release', function (type) {
        var _version = grunt.config.get('pkg').version;
        if (!/-SNAPSHOT$/i.test(_version)) {
            grunt.fail.warn('You can not release a version, must be a -SNAPSHOT.  Current version: ' + _version);
        }
        type = type ? type : 'patch';
        if (!/^(major|minor|patch)$/i.test(type)) {
            grunt.fail.warn('You can not release a "' + type + '" : must be type "major", "minor", "patch"');
            return;
        }
        grunt.task.run('test');
        grunt.task.run('bump-version:snapshot');
        grunt.task.run('update-package-json');

        grunt.task.run('optimize');

        grunt.task.run('compress');

        // TAG IT IN GIT
        grunt.task.run('tagrelease');

        // PUSH TO THE CDN

        grunt.task.run('bump-version:' + type);
        grunt.task.run('bump-version:snapshot');
    });
};
