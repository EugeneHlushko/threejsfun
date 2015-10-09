var _dir = '../search_engine/';
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'extended',
          sourcemap: 'file',
        },
        src: [
          _dir+'style/sources/styles.scss',
        ],
        dest: _dir+'style/styles.min.css',
      }
    },

    watch: {
      files: [
        'app/**'
      ],
      tasks: ['default'],
      options: {
        livereload: true
      },
    },
    uglify: {
      dist: {
        options: {
          mangle: false
        },
        files: {
          '<%= pkg.jsroot %>scripts/main.js': ['<%= pkg.jsroot %>scripts/main.min.js'],
        },
      }
    },
    concat:
    {
      javascript:
      {
        src:
          [
            _dir+'script/sources/main.js'
          ],
        dest: _dir+'script/main.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', []);
  //grunt.registerTask('buildprod', ['concat:javascript', 'uglify:prod']);
};
