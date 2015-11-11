module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: '../',
            srcPath: 'resource/default/assets/sass/',
            deployPath: 'resource/default/assets/css/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        // Task configuration.
        sass: {
            compile:{
                files:[{
                    expand:true,
                    src:['**/*.scss'],
                    cwd:'<%= meta.srcPath %>',
                    dest:'<%= meta.deployPath %>',
                    ext:'.css'
                }],
                tasks: ['concat:css']
            },
            dynamic:{
                expand:true,
                ext:'.css',
                src:''
            }
        },
        concat: {//css文件合并
            css: {
                src: ['<%= meta.deployPath %>*.css','!<%= meta.deployPath %>full.css'],//当前grunt项目中路径下的src/css目录下的所有css文件
                dest: '<%= meta.deployPath %>full.css',  //生成到grunt项目路径下的dist文件夹下为all.css
                overwrite:true
            }
        },
        watch: {
            sass: {
                files: [
                    '<%= meta.srcPath %>**/*.scss'
                ],
                tasks: ['sass:compile'],
                options:{spawn:true}
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task.
    //grunt.registerTask('default', ['sass:compile']);
    grunt.registerTask('default', ['sass:compile','watch']);
};