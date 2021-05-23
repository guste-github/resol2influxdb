#!/bin/bash
# file: resol2influxdb/entrypoint.sh
set -e

LOGGING_INTERVAL=${LOGGING_INTERVAL:-30000}
USB_DEVICE=${USB_DEVICE:-/dev/ttyACM0}
INFLUXDB_HOST=${INFLUXDB_HOST:-influx}
INFLUXDB_PORT=${INFLUXDB_PORT:-8086}
INFLUXDB_NAME=${INFLUXDB_NAME:-resol}


# substitude env params in config.js
sed -i "s/loggingInterval: 30000/loggingInterval: $LOGGING_INTERVAL/g;
 	s#path: '/dev/ttyACM0'#path: '$USB_DEVICE'#g;
	s/host: 'influx'/host: '$INFLUXDB_HOST'/g;
	s/port: 8086/port: $INFLUXDB_PORT/g;
	s/database: 'resol'/database: '$INFLUXDB_NAME'/g" /src/config.js	

if [ "${1:0:1}" = '-' ]; then
	set -- node "$@"
fi

exec "$@"

