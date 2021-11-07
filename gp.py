import threading
from evdev import InputDevice, ecodes, list_devices
import time
import enum


class ButtonValues(enum.Enum):
    Release = 'release'
    Press = 'press'
    Hold = 'hold'

BUTTON_VALUE_MAP = {
    0: ButtonValues.Release,
    1: ButtonValues.Press,
    2: ButtonValues.Hold,
}

class Button:
    def __init__(self, button_code, translator) -> None:
        self.button_code = button_code
        self.translator = translator

    def __str__(self) -> str:
        return 'button_code: {}, translator: {}'.format(self.button_code, self.translator)

class ButtonCodes(enum.Enum):
    LEFT_X = 'LEFT_X'
    LEFT_Y = 'LEFT_Y'
    RIGHT_X = 'RIGHT_X'
    RIGHT_Y = 'RIGHT_Y'
    CROSS_X = 'CROSS_X'
    CROSS_Y = 'CROSS_Y'
    A = 'A'
    B = 'B'
    X = 'X'
    Y = 'Y'
    L1 = 'L1'
    L2 = 'L2'
    L3 = 'L3'
    R1 = 'R1'
    R2 = 'R2'
    R3 = 'R3'
    SELECT = 'SELECT'
    START = 'START'
    HOME = 'HOME'
    STAR = 'STAR'


class SN30Range(enum.Enum):
    Min = 0
    Max = 65535

class AxisRange(enum.Enum):
    Min = -1
    Max = 1

def translate_from_range_to_range(value, from_min, from_max, to_min, to_max):
    # Figure out how 'wide' each range is
    left_span = from_max - from_min
    right_span = to_max - to_min

    # Convert the left range into a 0-1 range (float)
    value_scaled = float(value - from_min) / float(left_span)

    # Convert the 0-1 range into a value in the right range.
    return to_min + (value_scaled * right_span)

TOLERANCE_RATE = 0.005
TOTAL_RANGE = abs(AxisRange.Min.value) + abs(AxisRange.Max.value)
TOLERANCE = TOTAL_RANGE * TOLERANCE_RATE
RANGE_MAX_FLOOR = AxisRange.Max.value - TOLERANCE
RANGE_MIN_CEIL = AxisRange.Min.value + TOLERANCE
MIDDLE = (AxisRange.Min.value + AxisRange.Max.value) / 2
MIDDLE_FLOOR = MIDDLE - TOLERANCE
MIDDLE_CEIL = MIDDLE + TOLERANCE

def translate_sn30_range(original_value=None):
    if original_value is None:
        return None

    t = translate_from_range_to_range(
        original_value,
        SN30Range.Min.value,
        SN30Range.Max.value,
        AxisRange.Min.value,
        AxisRange.Max.value
    )

    if t < RANGE_MIN_CEIL:
        return AxisRange.Min.value
    if t > RANGE_MAX_FLOOR:
        return AxisRange.Max.value

    if t > MIDDLE_FLOOR and t < MIDDLE_CEIL:
        return MIDDLE
    
    return round(t, 4)

def invert_value(value):
    if abs(value) > 0:
        return -value
    return value

def analog_x_translator(value):
    return translate_sn30_range(value)

def analog_y_translator(value):
    return invert_value(translate_sn30_range(value))

def digital_y_translator(value):
    return invert_value(value)

def button_translator(value):
    return BUTTON_VALUE_MAP[value]

EVENT_BUTTON_MAP = {
    0: Button(button_code=ButtonCodes.LEFT_X, translator=analog_x_translator),
    1: Button(button_code=ButtonCodes.LEFT_Y, translator=analog_y_translator),
    3: Button(button_code=ButtonCodes.RIGHT_X, translator=analog_x_translator),
    4: Button(button_code=ButtonCodes.RIGHT_Y, translator=analog_y_translator),
    16: Button(button_code=ButtonCodes.CROSS_X, translator=None),
    17: Button(button_code=ButtonCodes.CROSS_Y, translator=digital_y_translator),
    305: Button(button_code=ButtonCodes.A, translator=button_translator),
    304: Button(button_code=ButtonCodes.B, translator=button_translator),
    307: Button(button_code=ButtonCodes.X, translator=button_translator),
    306: Button(button_code=ButtonCodes.Y, translator=button_translator),
    308: Button(button_code=ButtonCodes.L1, translator=button_translator),
    310: Button(button_code=ButtonCodes.L2, translator=button_translator),
    314: Button(button_code=ButtonCodes.L3, translator=button_translator),
    309: Button(button_code=ButtonCodes.R1, translator=button_translator),
    311: Button(button_code=ButtonCodes.R2, translator=button_translator),
    315: Button(button_code=ButtonCodes.R3, translator=button_translator),
    312: Button(button_code=ButtonCodes.SELECT, translator=button_translator),
    313: Button(button_code=ButtonCodes.START, translator=button_translator),
    316: Button(button_code=ButtonCodes.HOME, translator=button_translator),
    317: Button(button_code=ButtonCodes.STAR, translator=button_translator),
}

class SN30Event:
    def __init__(self, button_code, value) -> None:
        self.button_code = button_code
        self.value = value

    def __str__(self) -> str:
        return 'button_code: {}, value: {}'.format(self.button_code, self.value)

class GP(threading.Thread):
    def __init__(self, debug=False, event_handler=None) -> None:
        super(GP, self).__init__()
        self.daemon = True
        self.device_path = None
        self.device = None
        self.debug = debug
        self.event_handler = event_handler

        self.start()

    def handle_event(self, evdev_event):
        if self.debug or self.event_handler:
            button = EVENT_BUTTON_MAP[evdev_event.code]

            sn30_val = evdev_event.value
            if button.translator:
                sn30_val = button.translator(sn30_val)
            
            sn30_event = SN30Event(button_code=button.button_code, value=sn30_val)
            if self.debug:
                print('DEBUG ===')
                print('evdev event', evdev_event)
                print('sn30 event', sn30_event)

            if self.event_handler:
                self.event_handler(sn30_event)

    def run(self):
        while True:
            if self.is_connected():
                try:
                    self.listen_for_events()
                except OSError as err:
                    print('Not connected.', err)
                    self.device_path = None
                    self.device = None
            else:
                print('Trying to connect...')
                if not self.try_connect():
                    time.sleep(2)


    def try_connect(self):
        paths = list_devices()
        for device_path in paths:
            device = InputDevice(device_path)
            if device.name == 'Pro Controller':
                self.device_path = device_path
                self.device = device
                print('Initialized "' + str(self.device.name) + '" at path `' + str(self.device_path) + '`')
                return True


    def is_connected(self):
        return self.device is not None


    def listen_for_events(self):
        print('Listening for device events!')
        for event in self.device.read_loop():
            if event.type == ecodes.EV_KEY or event.type == ecodes.EV_ABS:
                self.handle_event(event)


# ======

def B_handler(value):
    if value == ButtonValues.Press or value == ButtonValues.Hold:
        print('hello')
    elif value == ButtonValues.Release:
        print('goodbye')

def example_handler(event: SN30Event):
    if event.button_code == ButtonCodes.B:
        B_handler(event.value)

if __name__ == '__main__':
    gp = GP(debug=True, event_handler=example_handler)
    input("Press enter to exit\n")
