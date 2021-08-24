const chokidar = require('chokidar');
const child_process = require('child_process');
const path = require('path');
const log = require('./log')
class Fastreload {
    constructor() {
        this.__init__();
    }

    __init__        = () => {
        this.args               = process.argv;
        this.fileName           = this.args[2];
        this.cwd                = process.cwd();
        this.watchPaths         = [
            path.join(this.cwd, "/**/*.js")
        ];
        if (!this.fileName) {
            log('error',' ❌ Please give a valid file');
        } else {
            this.reload();
            this.watchForChanges();
        }

    }
    reload = () => {
        console.log('Starting 👉',this.fileName)
        if(this.process) this.process.kill('SIGTERM');
        this.process = child_process.spawn('node', [ this.fileName ]);
        this.process.stdout.on('data', function (stdout) {
            console.log(stdout.toString());
        });
        this.process.stderr.on('data', function (stderr) {
            log('error',stderr.toString())
        });
    }
    watchForChanges = () =>{
    chokidar.watch(this.watchPaths,{
        ignored         : '**/node_modules/*"',
        ignoreInitial   : true
    }).on('all', (event, path) => {
        if(this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            log('warning',`Changes in ${path} , reloding`)
            this.reload();
        }, 500);
    });
    
    };
};


module.exports = new Fastreload();