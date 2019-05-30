# gascop-rest
A REST interface for the Gascop POCSAG paging system

This tool was created out of the motivation to enable a connection to Gascop via a REST interface. In the next step it should be possible to trigger alarms from multiple computers via a local web interface. The original Gascop system supported this use case indirectly via Gmail2Pager. Here, however, it was desired to make this possible without being dependent on an Internet connection.
The original software had been made between 2010 and 2014 by Clive Cooper and was published on http://winpe.com/gascop/.

## Installation
After cloning the contents of this repository, install all dependencies
    npm install
Now that this is done, compile the typescript to javascript. There are different scripts for Unix and Windows OSes:
    npm run build  // For Unix systems
    npm run buildWindowsPS  // For Windows systems, PowerShell is required