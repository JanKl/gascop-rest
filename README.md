# gascop-rest
A REST interface for the Gascop POCSAG paging system

This tool was created out of the motivation to enable a connection to Gascop via a REST interface. In the next step it should be possible to trigger alarms from multiple computers via a local web interface. The original Gascop system supported this use case indirectly via Gmail2Pager. Here, however, it was desired to make this possible without being dependent on an Internet connection.
The original software had been made between 2010 and 2014 by Clive Cooper and was published on http://winpe.com/gascop/.

## Installation
Node.js and NPM are required for this project to run. The script has been tested with Node version 12.3.1.

After cloning the contents of this repository, you need to provide the script with a configuration file. A sample configuration file can be found in the project's root directory by the name of `config.example.json`. Rename the file to `config.json` and update the settings according to your needs.

Install all dependencies
```
npm install
```
Now that this is done, compile the TypeScript to JavaScript
```
npm run build
```
To run the script, execute either `npm start` for a one time start or `node_modules/pm2/bin/pm2 start` to keep the script running and have it restarted if an error should occur.
The service will now listen on port 1234. Open http://your-server:1234 in a browser to see the GUI of the web interface. Remember to also have your Gascop instance running.