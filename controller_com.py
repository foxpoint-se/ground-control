from gp import GP, ButtonCodes, translate_from_range_to_range


def my_event_handler(event):
    if event.button_code == ButtonCodes.LEFT_Y:
        translated_value = translate_from_range_to_range(event.value, -1, 1, -255, 255)
        print(f"Value to be sent: {translated_value}")
    elif event.button_code == ButtonCodes.RIGHT_Y:
        translated_value = event.value
        print(f"Value to be sent: {translated_value}")


if __name__ == '__main__':
    gp = GP(event_handler=my_event_handler)
    input("Press enter to exit\n")
