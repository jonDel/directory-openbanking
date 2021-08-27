import board
import time
from time import sleep
from adafruit_ina219 import ADCResolution, BusVoltageRange, INA219


I2C_BUS = board.I2C()
DICT_FINGER_ADDR = {
    'polegar rotacional': 0x41,
    'polegar linear    ': 0x44,
    'indicador         ': 0x45,
    'medio             ': 0x40,
    'anular            ': 0x42,
    'minimo            ': 0x43
}


def go_to_pos(finger,
              finger_str="anular",
              delay=0.003,
              reverse=True,
              n_points=1000):
    ina =  INA219(I2C_BUS, addr=DICT_FINGER_ADDR[finger_str])
    measures = []
    if reverse:
        pos = list(linspace(-0.4, 0.8, n_points))
    else:
        pos = list(linspace(0.8, -0.4, n_points))
    start = time.time()
    for ang in pos:
        finger.value = ang
        sleep(delay)
        current = ina.current
        measures.append([current, (ang +1)*90, time.time()])
    duration = time.time() - start
    print(f"Movement was performed in {duration:.2f}")
    return measures


def write_csv(measures, filename="current_angle"):
    with  open(f"{filename}.csv", "w") as dt:
        dt.write("current,angle,timestamp\n")
        for current, angle, timestamp in measures:
            dt.write(f"{current},{angle},{timestamp}\n")


