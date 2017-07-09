import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import {nameLibrary, PATH_DIST, PATH_SRC} from "./config-library.js";

export default {
    entry: PATH_SRC + nameLibrary + '.ts',
    format: 'umd',
    moduleName: 'ngautocomplete',
    sourceMap: true,
    external: [
        '@angular/core'
    ],
    dest: PATH_DIST + nameLibrary + ".umd.js",
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            module: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**'
        })
    ],
    onwarn: warning => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME'
        ];
        if (skip_codes.indexOf(warning.code) !== -1) return;
        console.error(warning);
    }
};