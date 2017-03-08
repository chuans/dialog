"use strict" ;

import babel from 'rollup-plugin-babel';

export default {
    entry : "src/index.js",
    dest : "dist/dialog.js",
    format : "umd" ,
    sourceMap:"inline",
    moduleName : 'Modal',
    plugins : [
        babel({exclude : './node_modules/**'})
    ]
}

