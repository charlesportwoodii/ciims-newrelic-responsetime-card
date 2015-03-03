module.exports = function(grunt) {

    // Register the NPM tasks we want
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-css-prefix');
    grunt.loadNpmTasks('grunt-text-replace');

    // Register the tasks we want to run
    grunt.registerTask('default', [
        'bower:install',
        'copy:root',
        'css_prefix:card',
        'concat:css',
        'replace',
        'cssmin:css',
        'concat:js',
        'uglify:js'
    ]);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        carddata: function() {
            var card = grunt.file.readJSON('card.json'),
                name = card.name,
                version = card.version;

            return name.toLowerCase() + "-" + version.replace(/\./g, "-");
        },

        paths: {
            bower: 'bower_components',
            lib: 'lib',
            css : 'css',
            js: 'js',
            fonts: 'fonts'
        },

        bower: {
          install: {
            options: {
              targetDir: "lib"
            }
          }
        },

        replace: {
            syntax_prefix: {
                src: [ 'card.css' ],
                overwrite: true, 
                replacements : [{
                    from: '-main-',
                    to: '.<%= carddata() %>'
                }]
            },
        },

        copy: {
            root: {
                expand: true,
                flatten: true,
                src:  '<%= paths.css %>/main.css',
                dest: '<%= paths.css %>/build',
            }
        },

        css_prefix: {
            card: {
                options: {
                    prefix: '<%= carddata() %> .'
                },
                files: {
                    '<%= paths.css %>/build/main.css': ['<%= paths.css %>/build/main.css']
                }
            }
        },

        concat: {
            css: {
                src: [
                    '<%= paths.css %>/build/*',
                ],
                dest: 'card.css'
            },
            js : {
                src: [
                    '<%= paths.bower %>/Chart.js/Chart.min.js',
                    '<%= paths.bower %>/d3/index.js',
                    '<%= paths.js %>/*'
                ],
                dest: 'card.js'
            }
        },

        cssmin : {
            css:{
                src: 'card.css',
                dest: 'card.css'
            }
        },

        uglify: {
            js: {
                files: {
                    'card.js' : ['card.js']
                }
            }

        },
        watch: {
          files: ['<%= paths.css %>/*', '<%= paths.js %>/*', '<%= paths.lib %>/*'],
          tasks: ['default']
        },
    });
};