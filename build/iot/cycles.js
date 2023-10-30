"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CycleManager = void 0;
const events_1 = require("events");
class CycleManager extends events_1.EventEmitter {
    ramAtDoor;
    powerStatus;
    hydraullicPressure;
    ramMoving;
    startTime;
    endTime;
    isCycleInProgress;
    ejectDoorSignal;
    CycleTimeMin;
    CycleTimeMax;
    hydraullicPressureThreshold;
    constructor() {
        super();
    }
    startCycle(ramMoving, isCycleInProgress) {
        if (ramMoving === 1 && !this.isCycleInProgress) {
            this.isCycleInProgress = true;
            this.startTime = new Date().toISOString();
        }
        else {
            this.isCycleInProgress = false;
        }
        if (ramMoving === 0) {
            this.isCycleInProgress = false;
        }
        return this.isCycleInProgress;
    }
    endCycle(ramAtDoor, isCycleInProgress, ejectDoorSignal) {
        if (ramAtDoor === 1 && isCycleInProgress && ejectDoorSignal === 1) {
            isCycleInProgress = false;
        }
        else {
            isCycleInProgress = true;
        }
        return isCycleInProgress;
    }
    main(msg) {
        const jsonObject = JSON.parse(msg);
        const { tag, value, timestamp } = jsonObject;
        if (tag === "RamMoving") {
            this.ramMoving = value;
            this.isCycleInProgress = this.startCycle(this.ramMoving, this.isCycleInProgress);
            if (this.isCycleInProgress === true) {
                this.startTime = new Date().toISOString();
            }
            return this.isCycleInProgress;
        }
        if (tag === "RamAtDoor") {
            this.ramAtDoor = value;
            if (this.ramAtDoor === 1 && this.hydraullicPressure <= this.hydraullicPressureThreshold) {
                // this.isCycleInProgress = this.invalidCycle(this.ramAtDoor, this.hydraulicPressure, this.powerStatus, this.isCycleInProgress);
                this.isCycleInProgress = false;
                console.log("Cycle Ended due to RamAtDoor and HydraullicPressure");
            }
        }
        if (tag === "EjectDoorSignal") {
            this.ejectDoorSignal = value;
            if (this.ejectDoorSignal === 1 && this.isCycleInProgress && this.ramAtDoor === 1) {
                this.ejectDoorSignal = value;
                this.isCycleInProgress = this.endCycle(this.ramAtDoor, this.isCycleInProgress, this.ejectDoorSignal);
                this.endTime = new Date().toISOString();
                const cycleDuration = (new Date(this.endTime).getTime() - new Date(this.startTime).getTime()) / 1000;
                console.log("Cycle Duration: ", cycleDuration);
                if (cycleDuration >= this.CycleTimeMin) {
                    const cycleData = {
                        cycleDuration: cycleDuration,
                        startTime: this.startTime,
                        endTime: this.endTime,
                    };
                    console.log("Cycle is Valid");
                    this.emit("Cycle Event", cycleData);
                }
                else {
                    console.log("Cycle is Invalid");
                }
                this.isCycleInProgress = false;
            }
            ;
        }
        ;
        if (tag === "HydraullicPressure") {
            this.hydraullicPressure = value;
        }
        if (tag === "Power") {
            this.powerStatus = value;
            if (this.powerStatus === 0) {
                this.isCycleInProgress = false;
                console.log("Power is Off");
            }
        }
    }
    moduleTwin(msg) {
        this.hydraullicPressureThreshold = msg.hydraulicPressureThreshold;
        this.CycleTimeMin = msg.cycleTimeMin;
        this.CycleTimeMax = msg.cycleTimeMax;
    }
}
exports.CycleManager = CycleManager;
