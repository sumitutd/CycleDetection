export interface desiredTwin {
  hydraulicPressureThreshold: number;
  cycleTimeMin: number;
  cycleTimeMax: number;
}

export interface tagSchema {
  tag: string;
  timestamp: string; // Should be in ISO 8601 format, e.g., "2023-07-27T12:34:56Z"
  value: number;
}

export interface mqttTags {
  ramMoving: number;
  EjectDoorSignal: number;
  hydraulicPressure: number;
  powerStatus: number;
  RamAtDoor: number;
}

export interface mqttMessage {
    ramAtDoor: number;
    powerStatus: number;
    hydraulicPressure: number;
    ramMoving: number;
    startTime: string;
    endTime: string;
    isCycleInProgress: boolean;
    ejectDoorSignal: number;
    CycleTimeMin: number;
    CycleTimeMax: number;
    HydraulicPressureThreshold: number;

}