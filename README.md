# Monitor.js
Monitors and visualize data received via USB (Arduino/Teensy)

The visualizer of the Arduino IDE is smomewhat rudimentary and slow - and also only to be handled withs some hack, if you want to use the "Serial Plotter" as visualization of data - without always scroling to the left when entering new data.

So I wrote a _Node-Module_ called monitor.js, which looks for serial data coming in over the specified USB-port and format this data as plain text and provides it as a little web server with the possibility to visualize the data in individual charts in the browser. Like in this screenshot:

![alt tag](images/Screenshot.png)

The node.js module provides all needed files to visualize the data in the browser, so after installing the module, you only need the browser of your choice an the you may collect the data from your embedded system and visualize it.

##What you need:
* All you find here in the package ([Chart.js](https://github.com/nnnick/Chart.js) is included)
* node.js and some packages (will be installed automatically)
* and, of course, an USB prot which feeds your monitor with data


