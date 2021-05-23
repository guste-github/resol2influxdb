'use strict';


const winston = require('winston');
const {
    HeaderSetConsolidator,
    Specification,
    SerialConnection,
    TcpConnection,
} = require('resol-vbus');

const Influx = require('influx');
const config = require('./config');


const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});


const connectionClassByName = {
    SerialConnection,
    TcpConnection,
};


const spec = Specification.getDefaultSpecification();


const generateInfluxData = async (headerSet) => {
    const packetFields = spec.getPacketFieldsForHeaders(headerSet.getSortedHeaders());

    const data = packetFields.map((pf) => {
        return {
            measurement: 'DeltasolBS',
            tags: { id: pf.id, name: pf.name },			
            fields: { rawValue: pf.rawValue },
        };
    });
    return data;
};

const writeHeaderSetToDB = async (headerSet, db) => {
    logger.debug('HeaderSet complete -> writing to InfluxDB');

    const data = await generateInfluxData(headerSet);

    await new Promise((resolve, reject) => {
        db.writePoints(data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};


const main = async () => {
    logger.debug('Connect to InfluxDB...');

    const db = new Influx.InfluxDB(config.influxDBConnectionOptions);

    db.getDatabaseNames()
        .then(names => {
            if (!names.includes(config.influxDBConnectionOptions.database)) {
		        logger.debug('Create Influx database...');
            return db.createDatabase(config.influxDBConnectionOptions.database)
           }
        })
        .then(() => {
            logger.debug('Database is ready...');
        })
        .catch(err => {
            logger.error(`Error creating Influx database!`)
        })

    logger.debug('Connect to VBus data source...');

    const hsc = new HeaderSetConsolidator({
        interval: config.loggingInterval,
    });

    const ConnectionClass = connectionClassByName [config.connectionClassName];

    const connection = new ConnectionClass(config.connectionOptions);

    connection.on('packet', (packet) => {
        hsc.addHeader(packet);
    });

    hsc.on('headerSet', (headerSet) => {
		writeHeaderSetToDB(headerSet, db).then(null, err => {
            logger.error(err);
        });
    });

    await connection.connect();

    hsc.startTimer();

    return new Promise((resolve, reject) => {
        // nop, just run forever
    });
};



if (require.main === module) {
    main(process.argv.slice(2)).then(null, err => {
        logger.error(err);
    });
} else {
    module.exports = main;
}
