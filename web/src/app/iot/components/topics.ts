export type FloatMsg = {
  data: number;
};

export const MOTOR_CMD_TOPIC = "motor/cmd";
export type MotorCmdMsg = FloatMsg;

// FloatMsg
export const RUDDER_VERTICAL_CMD = "rudder_vertical/cmd";
// FloatMsg
export const RUDDER_HORIZONTAL_CMD = "rudder_horizontal/cmd";
