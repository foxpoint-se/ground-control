from gp import GP, ButtonValues, ButtonCodes, translate_from_range_to_range


def B_handler(value):
    if value == ButtonValues.Press or value == ButtonValues.Hold:
        print('B press or hold')
    elif value == ButtonValues.Release:
        print('B release')


def my_event_handler(event):
    if event.button_code == ButtonCodes.LEFT_Y:
        print(f"Value received: {event.value}")


if __name__ == '__main__':
    gp = GP(event_handler=my_event_handler)
    input("Press enter to exit\n")



