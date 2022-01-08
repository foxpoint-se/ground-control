from gp import GP, ButtonValues, ButtonCodes
from utils.serial_helpers import SerialReaderWriter


def handle_receive_line(line):
    print('received', line)

reader_writer = SerialReaderWriter('/dev/ttyUSB0', on_message=handle_receive_line)
    
def B_handler(value):
    if value == ButtonValues.Press or value == ButtonValues.Hold:
        print('B press or hold')
    elif value == ButtonValues.Release:
        print('B release')

def my_event_handler(event):    
    if event.button_code == ButtonCodes.RIGHT_X or event.button_code == ButtonCodes.CROSS_X:
        msg = str(-event.value)
        line = 'R: {}'.format(msg)
        print('turn!', event.value)
        reader_writer.send(line)

    if event.button_code == ButtonCodes.LEFT_Y or event.button_code == ButtonCodes.CROSS_Y:
        msg = str(event.value)
        line = 'M: {}'.format(msg)
        print('motor!', event.value)
        reader_writer.send(line)

    if event.button_code == ButtonCodes.B:
        B_handler(event.value)
    else:
        print('some other button action')

gamepad = GP(debug=False, event_handler=my_event_handler)

if __name__ == '__main__':
    input("Press enter to exit\n")

