'use strict';


const Influx = require('influx');


const config = {

    /**
     * The inteval in milliseconds between two db writes.
     * @type {Number}
     */
    loggingInterval: 30000,

    /**
     * The name of the `Connection` subclass to use for connecting to the VBus.
     * @type {String}
     */
    connectionClassName: 'SerialConnection',

    connectionOptions: {
        /**
         * The path name / Serial port to use.
         * @type {String}
         */
        path: '/dev/ttyACM0',
    },

    // /**
     // * The name of the `Connection` subclass to use for connecting to the VBus.
     // * @type {String}
     // */
    // connectionClassName: 'TcpConnection',

    // connectionOptions: {
        // /**
         // * The host name / IP address of the VBus/LAN or Datalogger device.
         // * @type {String}
         // */
        // host: '192.168.13.21',

        // /**
         // * The password for the VBus/LAN or Datalogger device.
         // * @type {String}
         // */
        // password: 'vbus',
    // },

    /**
     * The InfluxDB connection options.
     * @type {String}
     */
    influxDBConnectionOptions: {
        /**
         * The host of the InfluxDB to connect to.
         * @type {String}
         */
        host: 'influx',
        /**
         * The port of the InfluxDB to connect to.
         * @type {Number}
         */
        port: 8086,
        database: 'resol',
        schema: [{
            measurement: 'DeltasolBS',
            tags: ['id', 'name'],
            fields: { rawValue: Influx.FieldType.FLOAT }
        }]
    },
};


module.exports = config;
