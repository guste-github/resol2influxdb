# resol2influxdb
RESOL VBus®/USB interface docker linux bridge to influxDB.

https://www.resol.de/de/produktdetail/13

# Get path name of connected VBus®/USB-Adapter
```console
$ dmesg | grep tty
[6036930.795670] cdc_acm 1-6:1.0: ttyACM0: USB ACM device
```
# Adjust environment variables (s. sample docker-compose.yml)
```yaml
  resol2influxdb:
    build: resol2influxdb
    restart: always
    devices:
      - "/dev/ttyACM0:/dev/ttyACM0"
    environment:
      - LOGGING_INTERVAL=30000
      - USB_DEVICE=/dev/ttyACM0
      - INFLUXDB_HOST=influxdb
      - INFLUXDB_PORT=8086
      - INFLUXDB_NAME=resol 
    depends_on:
      - influxdb
    logging:
      driver: syslog
      options:
        tag: "docker.{{.ImageName}}.{{.ID}}"
 ```
 
__resol2influxdb__:
- `LOGGING_INTERVAL` The interval in milliseconds between two db writes.
- `USB_DEVICE` Path name of connected VBus®/USB-Adapter.
- `INFLUXDB_HOST` The host of the InfluxDB to connect to.
- `INFLUXDB_PORT` The port of the InfluxDB to connect to.
- `INFLUXDB_NAME` The database name (Will be created if it doesn't exsist.)

# Legal Notices
RESOL and VBus are trademarks or registered trademarks of RESOL - Elektronische Regelungen GmbH.
All other trademarks are the property of their respective owners.
