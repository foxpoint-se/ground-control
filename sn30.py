from evdev import InputDevice, categorize, ecodes, list_devices
import enum


class SN30Range(enum.Enum):
    Min = 0
    Max = 65535

class AxisRange(enum.Enum):
    Min = -1
    Max = 1

def translate(value, from_min, from_max, to_min, to_max):
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

def translate_axis_value(original_value=None):
    if original_value is None:
        return None

    t = translate(
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


class ButtonValues(enum.Enum):
    Release = 'release'
    Press = 'press'
    Hold = 'hold'

class ButtonTypes(enum.Enum):
    Button = 'button'
    DigitalAxis = 'digital axis'
    AnalogAxis = 'analog axis'

BUTTON_VALUE_MAP = {
    0: ButtonValues.Release,
    1: ButtonValues.Press,
    2: ButtonValues.Hold,
}

class Button:
    def __init__(self, name=None, code=None, handler=None, type=None) -> None:
        self.name = name
        self.code = code
        self.handler = handler
        self.type = type

    def __str__(self) -> str:
        return 'Button { name: ' + str(self.name) \
            + ', code: ' + str(self.code) \
            + ', handler: ' + str(self.handler) \
            + '}'

class SN30:
    def __init__(self, debug=False, invert_y=True):
        try:
            self.device_path = list_devices()[0]
            self.device =  InputDevice(self.device_path)
            print('Initialized "' + str(self.device.name) + '" at path `' + str(self.device_path) + '`')
        except Exception as err:
            raise RuntimeError('Something went wrong.') from err

        self.debug = debug
        self.invert_y = invert_y

        self.buttons = [
            Button(name='LEFT_X', code=0, handler=None, type=ButtonTypes.AnalogAxis),
            Button(name='LEFT_Y', code=1, handler=None, type=ButtonTypes.AnalogAxis),
            Button(name='RIGHT_X', code=3, handler=None, type=ButtonTypes.AnalogAxis),
            Button(name='RIGHT_Y', code=4, handler=None, type=ButtonTypes.AnalogAxis),
            Button(name='CROSS_X', code=16, handler=None, type=ButtonTypes.DigitalAxis),
            Button(name='CROSS_Y', code=17, handler=None, type=ButtonTypes.DigitalAxis),
            Button(name='A', code=305, handler=None, type=ButtonTypes.Button),
            Button(name='B', code=304, handler=None, type=ButtonTypes.Button),
            Button(name='X', code=307, handler=None, type=ButtonTypes.Button),
            Button(name='Y', code=306, handler=None, type=ButtonTypes.Button),
            Button(name='L1', code=308, handler=None, type=ButtonTypes.Button),
            Button(name='L2', code=310, handler=None, type=ButtonTypes.Button),
            Button(name='L3', code=314, handler=None, type=ButtonTypes.Button),
            Button(name='R1', code=309, handler=None, type=ButtonTypes.Button),
            Button(name='R2', code=311, handler=None, type=ButtonTypes.Button),
            Button(name='R3', code=315, handler=None, type=ButtonTypes.Button),
            Button(name='SELECT', code=312, handler=None, type=ButtonTypes.Button),
            Button(name='START', code=313, handler=None, type=ButtonTypes.Button),
            Button(name='HOME', code=316, handler=None, type=ButtonTypes.Button),
            Button(name='STAR', code=317, handler=None, type=ButtonTypes.Button),
        ]

        self.button_code_map = {}

        for button in self.buttons:
            friendly_key = button.name
            code_key = button.code
            setattr(self, friendly_key, button)
            self.button_code_map[code_key] = button

            if self.debug:
                print('self.' + button.name, ' \t=', button)

    def start_listening(self):
        for event in self.device.read_loop():
            if event.type == ecodes.EV_KEY or event.type == ecodes.EV_ABS:
                button = self.button_code_map[event.code]

                if button and button.handler:
                    if button.type == ButtonTypes.DigitalAxis:
                        val = event.value
                        if self.invert_y and 'Y' in button.name and abs(val) > 0:
                            val = -val
                        button.handler(val)
                    elif button.type == ButtonTypes.AnalogAxis:
                        val = translate_axis_value(event.value)
                        if self.invert_y and 'Y' in button.name and abs(val) > 0:
                            val = -val
                        button.handler(val)
                    elif button.type == ButtonTypes.Button:
                        button.handler(BUTTON_VALUE_MAP[event.value])

                if self.debug:
                    print('===')
                    print('Event: ', event)
                    print('Corresponding button:', button)


           


# move somewhere else


def do_stuff(val):
    print('FISEN!!', val)

if __name__ == '__main__':
    gp = SN30()
    gp.RIGHT_Y.handler = do_stuff
    gp.LEFT_Y.handler = do_stuff
    gp.LEFT_X.handler = do_stuff
    gp.CROSS_X.handler = do_stuff
    gp.CROSS_Y.handler = do_stuff
    gp.B.handler = do_stuff
    gp.start_listening()
