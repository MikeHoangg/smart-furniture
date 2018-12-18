import time
import serial
from django.utils import timezone

from smartfurnitureapi import types


def get_iot_data(furniture):
    params = ['height', 'width', 'length', 'incline']
    if furniture.owner.prime_expiration_date and furniture.owner.prime_expiration_date <= timezone.now().date() and furniture.type in types.PRIME_FURNITURE_TYPES:
        params += ['temperature', 'massage', 'rigidity']
    ser = serial.Serial(port='/dev/ttyUSB0', baudrate=115200)
    data = [f'{param}:{furniture.current_options.count()},' + ','.join([
        str(f) for f in furniture.current_options.values_list(param, flat=True)]) for param in params]
    for d in data:
        ser.write(b'%s\n' % d.encode())
        time.sleep(1)
        while ser.inWaiting() > 0:
            line = ser.read()
            print(line)
