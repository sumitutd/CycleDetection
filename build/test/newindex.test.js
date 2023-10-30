"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iot_1 = require("../iot");
describe('CycleManager', () => {
    let cycleManager;
    let isCycleInProgress;
    let ramAtDoor;
    let ejectDoorSignal;
    let powerStatus;
    let ramMoving;
    let hydraullicPressure;
    let HydraullicPressureThreshold;
    let mockManager;
    beforeEach(() => {
        cycleManager = new iot_1.CycleManager();
    });
    test('startCycle should handle starting a cycle', () => {
        isCycleInProgress = false;
        const result = cycleManager.startCycle(1, isCycleInProgress);
        expect(result).toBe(true);
    });
    test('endCycle should handle ending a cycle', () => {
        isCycleInProgress = true;
        ramAtDoor = 1;
        ejectDoorSignal = 1;
        const result = cycleManager.endCycle(ramAtDoor, isCycleInProgress, ejectDoorSignal);
        expect(result).toBe(false);
    });
    test('endCycle should handle not ending a cycle', () => {
        isCycleInProgress = true;
        ramAtDoor = 0;
        ejectDoorSignal = 1;
        const result = cycleManager.endCycle(ramAtDoor, isCycleInProgress, ejectDoorSignal);
        expect(result).toBe(true);
    });
    test('Main should handle RamMoving and startCycle correctly', () => {
        const msg = '{"tag": "RamMoving", "value": 1, "timestamp": "someTimestamp"}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', false);
        const result = cycleManager.main(msg);
        expect(result).toBe(true);
    });
    test('Main should handle RamMoving signal when Cycle is already in Progress', () => {
        const msg = '{"tag": "RamMoving", "value": 1, "timestamp": "someTimestamp"}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        let result = cycleManager.main(msg);
        expect(result).toBe(false);
    });
    test('Main Should handle RamMoving if its a half cycle', () => {
        const msg = '{"tag": "RamMoving", "value": 0, "timestamp": "someTimestamp"}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        let result = cycleManager.main(msg);
        expect(result).toBe(false);
    });
    test('main should handle EjectDoorSignal and endCycle correctly (Valid Cycle)', () => {
        const sampleMessage = '{"tag": "EjectDoorSignal", "value": 1, "timestamp": 123}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        const FakeramAtDoor = Reflect.get(cycleManager, 'ramAtDoor');
        Reflect.set(cycleManager, 'ramAtDoor', 1);
        const FakeCycleTimeMin = Reflect.get(cycleManager, 'CycleTimeMin');
        Reflect.set(cycleManager, 'CycleTimeMin', 10);
        const FakeStartTime = Reflect.get(cycleManager, 'startTime');
        const startTime = new Date(new Date().getTime() - 30 * 1000);
        Reflect.set(cycleManager, 'startTime', startTime);
        const FakeEndTime = Reflect.get(cycleManager, 'endTime');
        const endTime = new Date(new Date().getTime() * 1000);
        Reflect.set(cycleManager, 'endTime', endTime);
        cycleManager.main(sampleMessage);
        expect(console.log).toHaveBeenCalledWith("Cycle is Valid");
    });
    test('main should handle EjectDoorSignal and endCycle correctly (Invalid Cycle)', () => {
        const sampleMessage = '{"tag": "EjectDoorSignal", "value": 1, "timestamp": 123}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        const FakeramAtDoor = Reflect.get(cycleManager, 'ramAtDoor');
        Reflect.set(cycleManager, 'ramAtDoor', 1);
        const FakeCycleTimeMin = Reflect.get(cycleManager, 'CycleTimeMin');
        Reflect.set(cycleManager, 'CycleTimeMin', 60);
        const FakeStartTime = Reflect.get(cycleManager, 'startTime');
        const startTime = new Date(new Date().getTime() - 30 * 1000);
        Reflect.set(cycleManager, 'startTime', startTime);
        const FakeEndTime = Reflect.get(cycleManager, 'endTime');
        const endTime = new Date(new Date().getTime() * 1000);
        Reflect.set(cycleManager, 'endTime', endTime);
        cycleManager.main(sampleMessage);
        expect(console.log).toHaveBeenCalledWith("Cycle is Invalid");
    });
    test('When Ram reaches the door and HydraullicPressure is below threshold the cycle should end', () => {
        const msg = '{"tag": "RamAtDoor", "value": 1, "timestamp": "someTimestamp"}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const fakehydraullicPressure = Reflect.get(cycleManager, 'hydraullicPressure');
        Reflect.set(cycleManager, 'hydraullicPressure', 3000);
        const fakehydraullicPressureThreshold = Reflect.get(cycleManager, 'hydraullicPressureThreshold');
        Reflect.set(cycleManager, 'hydraullicPressureThreshold', 4000);
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        const FakePoweStatus = Reflect.get(cycleManager, 'powerStatus');
        Reflect.set(cycleManager, 'powerStatus', true);
        cycleManager.main(msg);
        expect(console.log).toHaveBeenCalledWith("Cycle Ended due to RamAtDoor and HydraullicPressure");
    });
    test('When Ram reaches the door and HydraulicPressure is below threshold the cycle should continue', () => {
        const msg = '{"tag": "RamAtDoor", "value": 1, "timestamp": "someTimestamp"}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const fakehydraullicPressure = Reflect.get(cycleManager, 'hydraullicPressure');
        Reflect.set(cycleManager, 'hydraullicPressure', 6000);
        const fakehydraullicPressureThreshold = Reflect.get(cycleManager, 'hydraullicPressureThreshold');
        Reflect.set(cycleManager, 'hydraullicPressureThreshold', 4000);
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        const FakePoweStatus = Reflect.get(cycleManager, 'powerStatus');
        Reflect.set(cycleManager, 'powerStatus', true);
        cycleManager.main(msg);
        expect(isCycleInProgress).toBe(true);
    });
    test('Main should handle Power', () => {
        const sampleMessage = '{"tag": "Power", "value": 0, "timestamp": 123}';
        jest.spyOn(console, 'log').mockImplementation(() => { });
        const FakeisCycleInProgress = Reflect.get(cycleManager, 'isCycleInProgress');
        Reflect.set(cycleManager, 'isCycleInProgress', true);
        cycleManager.main(sampleMessage);
        expect(console.log).toHaveBeenCalledWith("Power is Off");
    });
    test("Handle Changes in Hydraullic Pressure", () => {
        const sampleMessage = '{"tag": "HydraullicPressure", "value": 22, "timestamp": 123}';
        const result = cycleManager.main(sampleMessage);
        expect(result).toBeUndefined();
    });
    test("Handle Changes in Module Twin", () => {
        const sampleMessage = '{"hydraulicPressureThreshold","cycleTimeMin","cycleTimeMax"}';
        const result = cycleManager.moduleTwin(sampleMessage);
        expect(result).toBeUndefined();
    });
    // test('run should subscribe to DesiredProperties and MqttData events', () => {
    //   const mockOn = jest.fn();
    //   iotEmitter.on = mockOn;
    //   cycleManager.run();
    //   expect(mockOn).toHaveBeenCalledWith('DesiredProperties', expect.any(Function));
    //   expect(mockOn).toHaveBeenCalledWith('MqttData', expect.any(Function));
    // });
});
