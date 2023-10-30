"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
let ramAtDoor;
let powerStatus;
let hydraulicPressure;
let ramMoving;
let startTime;
let endTime;
let isCycleInProgress;
let ejectDoorSignal;
let CycleTimeMin;
let CycleTimeMax;
let HydraulicPressureThreshold;
function startCycle(ramMoving, isCycleInProgress) {
    if (ramMoving === 1 && !isCycleInProgress) {
        isCycleInProgress = true;
    }
    else {
        isCycleInProgress = false;
    }
    return isCycleInProgress;
}
function endCycle(ramAtDoor, isCycleInProgress, ejectDoorSignal) {
    if (ramAtDoor === 1 && isCycleInProgress && ejectDoorSignal === 1) {
        isCycleInProgress = false;
    }
    else {
        isCycleInProgress = true;
    }
    return isCycleInProgress;
}
function invalidCycle(ramAtDoor, hydraulicPressure, powerStatus, isCycleInProgress) {
    if (isCycleInProgress && powerStatus === 0 || (ramAtDoor === 1 && hydraulicPressure >= HydraulicPressureThreshold && isCycleInProgress)) {
        isCycleInProgress = false;
        console.log("Cycle is Invalid");
    }
    return isCycleInProgress;
}
function main(msg) {
    const jsonObject = JSON.parse(msg);
    const { tag, value, timestamp } = jsonObject;
    if (tag === "revpi/event/RamMoving" && value === 1) {
        console.log("Ram Moving");
        ramMoving = value;
        isCycleInProgress = startCycle(ramMoving, isCycleInProgress);
        startTime = new Date().toISOString();
        console.log("Cycle Started at", startTime);
    }
    if (tag === "revpi/event/RamAtDoor" && value === 1) {
        console.log("Ram At Door");
        ramAtDoor = value;
    }
    if (tag === "revpi/event/EjectDoorSignal" && value === 1 && isCycleInProgress) {
        console.log("Eject Door Signal");
        ejectDoorSignal = value;
        isCycleInProgress = endCycle(ramAtDoor, isCycleInProgress, ejectDoorSignal);
        endTime = new Date().toISOString();
        console.log("Cycle Ended at", endTime);
        const cycleDuration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
        if (cycleDuration >= CycleTimeMax) {
            console.log("Cycle is Valid", cycleDuration);
        }
        else {
            console.log("Cycle is Invalid", cycleDuration);
        }
    }
    if (tag === "revpi/event/HydraullicPressure" && value >= HydraulicPressureThreshold && ramAtDoor === 1 && isCycleInProgress) {
        console.log("Hydraullic Pressure");
        hydraulicPressure = value;
        isCycleInProgress = invalidCycle(ramAtDoor, hydraulicPressure, powerStatus, isCycleInProgress);
    }
    if (tag === "revpi/event/Power" && value === 0) {
        console.log("Power Signal");
        powerStatus = value;
        console.log("Power Status", powerStatus);
        isCycleInProgress = invalidCycle(ramAtDoor, hydraulicPressure, powerStatus, isCycleInProgress);
    }
}
exports.main = main;
