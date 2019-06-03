# gascop-rest
A REST interface for the Gascop POCSAG paging system

This tool was created out of the motivation to enable a connection to Gascop via a REST interface. In the next step it should be possible to trigger alarms from multiple computers via a local web interface. The original Gascop system supported this use case indirectly via Gmail2Pager. Here, however, it was desired to make this possible without being dependent on an Internet connection.
The original software had been made between 2010 and 2014 by Clive Cooper and was published on http://winpe.com/gascop/.

## Installation
Node.js and NPM are required for this project to run. The script has been tested with Node version 12.3.1.

After cloning the contents of this repository, you need to provide the script with a configuration file. A sample configuration file can be found in the project's root directory by the name of `config.example.json`. Rename the file to `config.json` and set the absolute path to the Gascop DB file.

Install all dependencies
```
npm install
```
Now that this is done, compile the typescript to javascript. There are different scripts for Unix and Windows OSes:
```
npm run build  // For Unix systems
npm run buildWindowsPS  // For Windows systems, PowerShell is required
```
To run the script, execute
```
npm start
```
The service will now listen on port 1234. Open http://your-server:1234 in a browser to see the GUI of the web interface. Remember to also have your Gascop instance running.