var gulp       = require('gulp');
var babel      = require('gulp-babel');
var browserify = require('gulp-browserify');
var react      = require('gulp-react');
var plumber    = require('gulp-plumber');
var less       = require('gulp-less');
var uglify     = require('gulp-uglify');
var minifycss  = require('gulp-minify-css');
var rename     = require('gulp-rename');
var clean      = require('gulp-clean');
var concat     = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var underscore = require('underscore');

/***************** CẤU HÌNH *****************/
var
    $src = 'source',
    $dst = {
        debug: {
            cfg:    '/config.debug.js',
            dst:    'build/debug',
            minify: false
        },
        lab: {
            cfg:    '/config.lab.js',
            dst:    'build/lab',
            minify: false
        },
        beta: {
            cfg:    '/config.beta.js',
            dst:    'build/beta',
            minify: false
        },
        beta_asap: {
            cfg:    '/config.beta-asap.js',
            dst:    'build/beta-asap',
            minify: true
        },
        asap: {
            cfg:    '/config.asap.js',
            dst:    'build/asap',
            minify: true
        },
        commercial: {
            cfg:    '/config.commercial.js',
            dst:    'build/commercial',
            minify: true
        }
    }
    ;
var $path = {
    css    : $src + '/css/*.css',
    cssImg : $src + '/css/images/**/*',
    img    : $src + '/img/**/*',
    html   : [ $src + '/index.html', $src + '/booking.html' ],
    jsx    : $src + '/**/*.jsx',
    js     : [
        $src + '/**/*.js',
        '!' + $src + '/config.*.js'
    ],
    removeFiles: [
        '/js/locale',
        '/js/components',
        '/js/App.js',
        '/js/AppAction.js',
        '/js/AppDispatcher.js',
        '/js/AppStore.js',
        '/js/config.js',
        '/js/AppContainer.js',
        '/js/locale.js',
        '/js/Utils.js'
    ]
};

/***************** TASK MẪU *****************/
var tasks = {
    clean: function( $target ) {
        return gulp.src( $target.dst, {read: false} )
            .pipe(plumber())
            .pipe(clean())
            ;
    },

    makeConfig: function( $target ) {
        return gulp.src( $src + $target.cfg )
            .pipe(plumber())
            .pipe(rename({basename: 'config'}))
            .pipe(gulp.dest( $target.dst + '/js' ))
            ;
    },

    makeCss: function( $target ) {
        return gulp.src( $target.css )
            .pipe(plumber())
            .pipe(concat('index.css'))
            .pipe(gulp.dest( $target.dst+'/css/' ))
            ;
    },

    copyImage: function( $target ) {
        return gulp.src( $target.img )
            .pipe(plumber())
            .pipe(gulp.dest( $target.dst + '/img' ))
            ;
    },

    copyCssImage: function( $target ) {
        return gulp.src( $target.cssImg )
            .pipe(plumber())
            .pipe(gulp.dest( $target.dst + '/css/images' ))
            ;
    },

    copyHtml: function( $target ) {
        return gulp.src( $target.html )
            .pipe(plumber())
            .pipe(gulp.dest( $target.dst ))
            ;
    },

    copyScript: function( $target ) {
        return gulp.src( $target.js )
            .pipe(plumber())
            .pipe(gulp.dest( $target.dst ))
            ;
    },

    react: function( $target ) {
        return gulp.src( $target.jsx )
            .pipe(plumber())
            .pipe(react())
            .pipe(gulp.dest( $target.dst + '/' ))
            ;
    },

    babel: function( $target ) {
        return gulp.src( [$target.dst + '/**/*.js', '!' + $target.dst + '/lib/**/*.js'] )
            .pipe(plumber())
            .pipe(babel())
            .pipe(gulp.dest( $target.dst + '/' ))
            ;
    },

    browserifyIndex: function( $target ) {
        return gulp.src( $target.dst + '/js/index.js' )
            .pipe(plumber())
            .pipe(browserify())
            .pipe(gulp.dest( $target.dst + '/js/' ))
            ;
    },

    browserifyScript: function( $target ) {
        return gulp.src( $target.dst + '/script.js' )
            .pipe(plumber())
            .pipe(browserify())
            .pipe(gulp.dest( $target.dst + '/' ))
            ;
    },

    removeFiles: function( $target ) {
        var removes = [];
        for(var i=0,l=$target.removeFiles.length; i<l; i++) {
            removes.push( $target.dst + $target.removeFiles[i] );
        }
        return gulp.src( removes, {read: false} )
            .pipe(plumber())
            .pipe(clean())
            ;
    },

    minifyCss: function( $target ) {
        return gulp.src( $target.dst + '/css/index.css' )
            .pipe(plumber())
            .pipe(minifycss())
            .pipe(gulp.dest( $target.dst + '/css/' ))
            ;
    },

    minifyJsIndex: function( $target ) {
        return gulp.src( $target.dst + '/js/index.js' )
            .pipe(plumber())
            .pipe(uglify())
            .pipe(gulp.dest( $target.dst + '/js/' ))
            ;
    },

    minifyJsScript: function( $target ) {
        return gulp.src( $target.dst + '/script.js' )
            .pipe(plumber())
            .pipe(uglify())
            .pipe(gulp.dest( $target.dst + '/' ))
            ;
    },

    stripDebug: function( $target ) {
        return gulp.src( [$target.dst + '/js/index.js'] )
            .pipe(plumber())
            .pipe(uglify())
            .pipe(gulp.dest( $target.dst + '/' ))
            ;
    }
};

/***************** KHAI BÁO TASK *****************/
underscore.each($dst, function(config, name){
    var target = underscore.extend( $dst[name], $path );

    gulp.task('transform', function () {
        return gulp.src('*.jsx')
          .pipe(react({harmony: false, es6module: true}))
          .pipe(gulp.dest('output'));
    });

    gulp.task('clean-' + name, function(){
        return tasks.clean(target);
    });
    gulp.task('make-config-' + name, ['clean-' + name], function(){
        return tasks.makeConfig(target);
    });
    gulp.task('make-css-' + name, ['clean-' + name], function(){
        return tasks.makeCss(target);
    });
    gulp.task('copy-image-' + name, ['clean-' + name], function(){
        return tasks.copyImage(target);
    });
    gulp.task('copy-css-image-' + name, ['clean-' + name], function(){
        return tasks.copyCssImage(target);
    });
    gulp.task('copy-html-' + name, ['clean-' + name], function(){
        return tasks.copyHtml(target);
    });
    gulp.task('copy-script-' + name, ['clean-' + name], function(){
        return tasks.copyScript(target);
    });
    gulp.task('react-' + name, ['clean-' + name, 'make-config-' + name, 'copy-script-' + name], function(){
        return tasks.react(target);
    });
    // gulp.task('babel-' + name, ['react-' + name], function(){
    // 	return tasks.babel(target);
    // });
    gulp.task('browserify-index-' + name, ['react-' + name, 'transform'], function(){
        return tasks.browserifyIndex(target);
    });
    gulp.task('browserify-script-' + name, ['react-' + name, 'transform'], function(){
        return tasks.browserifyScript(target);
    });
    gulp.task('browserify-' + name, ['browserify-index-' + name, 'browserify-script-' + name]);
    gulp.task('clean-tmp-' + name, ['browserify-' + name], function(){
        return tasks.removeFiles(target);
    });

    if(target.minify) {
        gulp.task('minify-css-' + name, ['make-css-' + name], function(){
            return tasks.minifyCss(target);
        });
        gulp.task('minify-js-index-' + name, ['browserify-' + name], function(){
            return tasks.minifyJsIndex(target);
        });
        gulp.task('minify-js-script-' + name, ['browserify-' + name], function(){
            return tasks.minifyJsScript(target);
        });
        gulp.task('minify-js-' + name, ['minify-js-index-' + name, 'minify-js-script-' + name]);
        gulp.task('strip-debug-' + name, ['minify-js-' + name], function(){
            return tasks.stripDebug(target);
        });
    }
});

var cleanTasks = [];
var makeConfigTasks = [];
var makeCssTasks = [];
var copyImageTasks = [];
var copyCssImageTasks = [];
var copyHtmlTasks = [];
var copyScriptTasks = [];
var reactTasks = [];
var babelTasks = [];
var browserifyTasks = [];
var cleanTmpTasks = [];
var minifyCssTasks = [];
var minifyJsTasks = [];
var stripDebugTasks = [];

var MODES = {};
for( var name in $dst ) {
    if(typeof MODES[name] == 'undefined')
        MODES[name] = [];

    cleanTasks.push('clean-' + name);
    MODES[name].push('clean-' + name);

    makeConfigTasks.push('make-config-' + name);
    MODES[name].push('make-config-' + name);

    makeCssTasks.push('make-css-' + name);
    MODES[name].push('make-css-' + name);

    copyImageTasks.push('copy-image-' + name);
    MODES[name].push('copy-image-' + name);

    copyCssImageTasks.push('copy-css-image-' + name);
    MODES[name].push('copy-css-image-' + name);

    copyHtmlTasks.push('copy-html-' + name);
    MODES[name].push('copy-html-' + name);

    copyScriptTasks.push('copy-script-' + name);
    MODES[name].push('copy-script-' + name);

    reactTasks.push('react-' + name);
    MODES[name].push('react-' + name);

    // babelTasks.push('babel-' + name);
    // MODES[name].push('babel-' + name);

    browserifyTasks.push('browserify-' + name);
    MODES[name].push('browserify-' + name);

    cleanTmpTasks.push('clean-tmp-' + name);
    MODES[name].push('clean-tmp-' + name);

    if($dst[name].minify) {
        minifyCssTasks.push('minify-css-' + name)
        MODES[name].push('minify-css-' + name);

        minifyJsTasks.push('minify-js-' + name)
        MODES[name].push('minify-js-' + name);

        stripDebugTasks.push('strip-debug-' + name)
        MODES[name].push('strip-debug-' + name);
    }
}
gulp.task('clean', cleanTasks);
gulp.task('make-config', makeConfigTasks);
gulp.task('make-css', makeCssTasks);
gulp.task('copy-image', copyImageTasks);
gulp.task('copy-css-image', copyCssImageTasks);
gulp.task('copy-html', copyHtmlTasks);
gulp.task('copy-script', copyScriptTasks);
gulp.task('react', reactTasks);
// gulp.task('babel', babelTasks);
gulp.task('browserify', browserifyTasks);
gulp.task('clean-tmp', cleanTmpTasks);
gulp.task('minify-css', minifyCssTasks);
gulp.task('minify-js', minifyJsTasks);
gulp.task('strip-debug', stripDebugTasks);


for(var name in MODES) {
    gulp.task('build-' + name, MODES[name]);
    gulp.task(name, MODES[name]);
}

gulp.task('build', [
    'clean',
    'make-config',
    'copy-script', 'make-css', 'copy-image', 'copy-html', 'copy-css-image',
    'react',
    'browserify',
    'minify-css', 'minify-js',
    'strip-debug',
    'clean-tmp'
]);
gulp.task('default', [
    'clean',
    'make-config',
    'copy-script', 'make-css', 'copy-image', 'copy-html', 'copy-css-image',
    'react',
    'browserify',
    'minify-css', 'minify-js',
    'strip-debug',
    'clean-tmp'
]);
