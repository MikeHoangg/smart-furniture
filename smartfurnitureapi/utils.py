import serial
from django.utils import timezone

from smartfurnitureapi import types

IOT_PORT = '/dev/ttyUSB0'


def get_iot_data(furniture):
    params = ['height', 'width', 'length', 'incline']
    if furniture.owner.prime_expiration_date and furniture.owner.prime_expiration_date <= timezone.now().date() and furniture.type in types.PRIME_FURNITURE_TYPES:
        params += ['temperature', 'massage', 'rigidity']
    ser = serial.Serial(port=IOT_PORT, baudrate=115200)
    data = [furniture.__str__()]
    data += [f'{param}:{furniture.current_options.count()},' + ','.join([
        str(f) for f in furniture.current_options.values_list(param, flat=True)]) for param in params]
    res = []
    for d in data:
        ser.write(b'%s\n' % d.encode())
        while True:
            line = ser.readline()
            if line:
                res.append(line.decode())
                break
    print(*res, sep="")
