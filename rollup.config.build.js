"use strict" ;

let rollup = require('rollup');
let babel = require('rollup-plugin-babel');
let uglify = require('rollup-plugin-uglify');

rollup.rollup({
    entry : "src/index.js",
    plugins : [
        babel({exclude : './node_modules/**'})
    ]
}).then(function( bundle ){
    bundle.write({
        dest : "dist/dialog.min.js",
        format : "umd" ,
        sourceMap:"inline",
        moduleName : 'Modal',
    })
    //加入压缩代码
    rollup.rollup({
        entry: 'src/index.js',
        plugins: [
            uglify(),   // 加入压缩代码
            babel({exclude : './node_modules/**'})
        ]
    }).then(function(bundle) {
        bundle.write({
            format: 'umd',
            moduleName: 'Modal',
            sourceMap: 'inline',
            dest: 'dist/dialog.min.js'
        });
    })

})
