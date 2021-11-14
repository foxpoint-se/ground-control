import serial

from gp import GP, ButtonCodes, translate_from_range_to_range


class HC12:
    def __init__(self):
        self.ser = serial.Serial("/dev/ttyUSB0", 9600)

    def send(self, msg):
        self.ser.write(bytes(f"{msg}", encoding='utf-8'))


com = HC12()


def my_event_handler(event):
    message = ""

    if event.button_code == ButtonCodes.LEFT_Y:
        translated_value = translate_from_range_to_range(event.value, -1, 1, -255, 255)
        message = f"M{translated_value}"

    elif event.button_code == ButtonCodes.RIGHT_X:
        translated_value = translate_from_range_to_range(event.value, -1, 1, 750, 2250)
        message = f"S{translated_value}"

    print(f"Sending value: {translated_value}")
    com.send(message)


if __name__ == '__main__':
    gp = GP(event_handler=my_event_handler)
    input("Press enter to exit\n")
