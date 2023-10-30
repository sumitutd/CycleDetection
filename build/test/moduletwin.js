"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iotEmitter = void 0;
const azure_iot_device_1 = require("azure-iot-device");
const azure_iot_device_mqtt_1 = require("azure-iot-device-mqtt");
const events_1 = require("events");
class IoTEventEmitter extends events_1.EventEmitter {
}
exports.iotEmitter = new IoTEventEmitter();
let hydraulicPressureThreshold;
let cycleTimeMin;
let cycleTimeMax;
async function iiot(client) {
    if (!client) {
        client = await azure_iot_device_1.ModuleClient.fromEnvironment(azure_iot_device_mqtt_1.Mqtt);
        await client.open();
        client.getTwin((err, twin) => {
            twin.on("properties.desired", (desiredProperties) => {
                console.log("Twin object on properties.desired event: ", desiredProperties);
                const mappedDesiredProperties = {
                    hydraulicPressureThreshold: desiredProperties.hydraulicPressureThreshold,
                    cycleTimeMin: desiredProperties.cycleTimeMin,
                    cycleTimeMax: desiredProperties.cycleTimeMax,
                };
                exports.iotEmitter.emit("DesiredProperties", mappedDesiredProperties);
            });
        });
        client.on('inputMessage', (inputName, msg) => {
            const messagePayload = msg.getBytes().toString();
            const jsonObject = JSON.parse(messagePayload);
            const { tag, value, timestamp } = jsonObject;
            exports.iotEmitter.emit("MqttData", messagePayload);
        });
    }
}
exports.default = iiot;
