import json

import serial
from django.utils import timezone

from smartfurnitureapi import types

# TODO give permissions each time, the right port
IOT_PORT = '/dev/ttyUSB0'


def get_iot_data(furniture):
    params = ['height', 'width', 'length', 'incline']
    if furniture.owner.prime_expiration_date \
            and furniture.owner.prime_expiration_date <= timezone.now().date() \
            and furniture.type in types.PRIME_FURNITURE_TYPES:
        params += ['temperature', 'massage', 'rigidity']
    data = {"name": furniture.__str__()}
    count = furniture.current_options.count()
    for param in params:
        data[param] = [count] + list(furniture.current_options.values_list(param, flat=True))
    ser = serial.Serial(port=IOT_PORT, baudrate=115200)
    ser.write(b'%s\n' % json.dumps(data).encode())
    res = json.loads(ser.readline().decode())
    for key, val in res.items():
        print(f"{key}: {val}")

