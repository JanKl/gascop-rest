/**
 * Build script for gascop-rest.
 * Copies all static files to the build directory and
 * transpiles the TypeScript files afterwards.
 */
var shell = require('shelljs');

// Create/Empty build directory and copy static files.
shell.mkdir("-p", "build");
shell.rm("-rf", "build/*");
shell.cp("-r", "src_js/*", "build");

// Copy JavaScript GUI frameworks
shell.cp("node_modules/jquery/dist/jquery.min.js", "build/public/javascripts/jquery.min.js");
shell.cp("node_modules/jquery/dist/jquery.min.map", "build/public/javascripts/jquery.min.map");
shell.cp("node_modules/popper.js/dist/umd/popper.min.js", "build/public/javascripts/popper.min.js");
shell.cp("node_modules/popper.js/dist/umd/popper.min.js.map", "build/public/javascripts/popper.min.js.map");
shell.cp("node_modules/bootstrap/dist/js/bootstrap.min.js", "build/public/javascripts/bootstrap.min.js");
shell.cp("node_modules/bootstrap/dist/js/bootstrap.min.js.map", "build/public/javascripts/bootstrap.min.js.map");
shell.cp("node_modules/bootstrap/dist/css/bootstrap.min.css", "build/public/stylesheets/bootstrap.min.css");
shell.cp("node_modules/bootstrap/dist/css/bootstrap.min.css.map", "build/public/stylesheets/bootstrap.min.css.map");

// Transpile TypeScript
shell.exec("npm run tsc");