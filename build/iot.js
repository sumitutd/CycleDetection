"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CycleManager = void 0;
const cycles_1 = require("./iot/cycles");
Object.defineProperty(exports, "CycleManager", { enumerable: true, get: function () { return cycles_1.CycleManager; } });
const azure_iot_device_1 = require("azure-iot-device");
const azure_iot_device_mqtt_1 = require("azure-iot-device-mqtt");
const moduleTwin_1 = __importDefault(require("./iot/moduleTwin"));
async function initializeReceiver() {
    const edgeClient = await azure_iot_device_1.ModuleClient.fromEnvironment(azure_iot_device_mqtt_1.Mqtt);
    const iotHub = new moduleTwin_1.default(edgeClient);
    const cycleManager = new cycles_1.CycleManager();
    iotHub.on("DesiredProperties", (msg) => {
        cycleManager.moduleTwin(msg);
    });
    iotHub.on("MqttData", (msg) => {
        cycleManager.main(msg);
    });
    cycleManager.on("Cycle Event", (msg) => {
        iotHub.messaging(msg);
    });
}
initializeReceiver().catch(error => {
    console.error('Error initializing Receiver:', error);
});
