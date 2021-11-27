from gp import GP, ButtonValues, ButtonCodes
from readerwriter import Runner


def handle_receive_line(line):
    print('received', line)

hc12_runner = Runner(port_name='/dev/ttyUSB0', on_receive_line=handle_receive_line, use_sim=False)
hc12_runner.start()
    
def B_handler(value):
    if value == ButtonValues.Press or value == ButtonValues.Hold:
        print('B press or hold')
    elif value == ButtonValues.Release:
        print('B release')

def my_event_handler(event):    
    if event.button_code == ButtonCodes.RIGHT_X or event.button_code == ButtonCodes.CROSS_X:
        msg = str(-event.value)
        line = 'R: {}\n'.format(msg)
        print('turn!', event.value)
        hc12_runner.send(message=line)

    if event.button_code == ButtonCodes.LEFT_Y:
        msg = str(event.value)
        line = 'M: {}\n'.format(msg)
        print('motor!', event.value)
        hc12_runner.send(message=line)
    # print('send this', msg)

    # if event.button_code == ButtonCodes.B:
    #     B_handler(event.value)
    # else:
    #     print('some other button action')

gamepad = GP(debug=False, event_handler=my_event_handler)

if __name__ == '__main__':
    input("Press enter to exit\n")

