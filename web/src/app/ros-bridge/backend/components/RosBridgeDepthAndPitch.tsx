import { DepthAndPitch } from "@/app/components/new/DepthAndPitch";
import ROSLIB from "roslib";
import {
  useDepthControlStatus,
  useFrontTankSubscriber,
  useImuSubscriber,
  usePressureSubscriber,
  useRearTankSubscriber,
} from "./rosBridge";
import {
  DepthControlStatus,
  ImuStatus,
  PressureStatus,
  TankStatus,
} from "@/app/components/new/topics";
import { useState } from "react";

export const RosBridgeDepthAndPitch = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [frontStatus, setFrontStatus] = useState<TankStatus>();
  const [rearStatus, setRearStatus] = useState<TankStatus>();
  const [pressureStatus, setPressureStatus] = useState<PressureStatus>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [depthControlStatus, setDepthControlStatus] =
    useState<DepthControlStatus>();

  useFrontTankSubscriber(rosBridge, setFrontStatus);
  useRearTankSubscriber(rosBridge, setRearStatus);
  usePressureSubscriber(rosBridge, setPressureStatus);
  useImuSubscriber(rosBridge, setImuStatus);
  useDepthControlStatus(rosBridge, setDepthControlStatus);

  const frontTargetLevel =
    frontStatus?.target_level && frontStatus.target_level[0];
  const rearTargetLevel =
    rearStatus?.target_level && rearStatus.target_level[0];

  return (
    <DepthAndPitch
      depth={pressureStatus?.depth}
      frontTank={frontStatus?.current_level}
      rearTank={rearStatus?.current_level}
      pitch={imuStatus?.pitch}
      pitchVelocity={imuStatus?.pitch_velocity}
      frontIsAutocorrecting={frontStatus?.is_autocorrecting}
      rearIsAutocorrecting={rearStatus?.is_autocorrecting}
      frontTargetLevel={frontTargetLevel}
      rearTargetLevel={rearTargetLevel}
      frontTargetStatus={frontStatus?.target_status}
      rearTargetStatus={rearStatus?.target_status}
      depthVelocity={pressureStatus?.depth_velocity}
      depthTarget={depthControlStatus?.depth_target}
    />
  );
};
