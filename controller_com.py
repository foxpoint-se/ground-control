from gp import GP, ButtonValues, ButtonCodes


def B_handler(value):
    if value == ButtonValues.Press or value == ButtonValues.Hold:
        print('B press or hold')
    elif value == ButtonValues.Release:
        print('B release')


def my_event_handler(event):
    if event.button_code == ButtonCodes.LEFT_Y:
        print(f"Value received: {event.value}")


my_gamepad = GP(event_handler=my_event_handler)

