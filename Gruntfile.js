module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: { default:"<%= pkg.dest %>"},
    jshint: {
      options: { force :true },
      files: ['Gruntfile.js', 'src/**/*.js']
    },
    cssmin: {
      combine: {
        files: {
          '<%= pkg.dest %>/<%= pkg.name %>.css': ['<%= pkg.src %>/*.css']
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: '<%= pkg.dest %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! Copyright (C) 2014 Miroslav Bimbo <mbi@eea.sk>\n*\n* This file is part of Crimemap.\n*\n* Crimemap is free software: you can redistribute it and/or modify\n* it under the terms of the GNU Affero General Public License as published by\n* the Free Software Foundation, either version 3 of the License, or\n* (at your option) any later version.\n*\n* Crimemap is distributed in the hope that it will be useful,\n* but WITHOUT ANY WARRANTY; without even the implied warranty of\n* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n* GNU Affero General Public License for more details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with Crimemap. If not, see <http://www.gnu.org/licenses/>.\n*\n/'
      },
      dist: {
        files: {
          '<%= pkg.dest %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['clean', 'cssmin', 'jshint', 'concat', 'uglify']);

};