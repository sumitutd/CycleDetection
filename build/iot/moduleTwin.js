"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const azure_iot_device_1 = require("azure-iot-device");
const events_1 = require("events");
class iotHubMessages extends events_1.EventEmitter {
    edgeClient;
    dersiredProperties;
    constructor(edgeClient) {
        super();
        this.edgeClient = edgeClient;
        this.clientConnection();
        this.clientMessages();
    }
    async clientConnection() {
        await this.edgeClient.open();
        this.edgeClient.getTwin((err, twin) => {
            twin?.on("properties.desired", (twin) => {
                console.log("Desired properties have been updated to: ", twin);
                this.dersiredProperties = {
                    hydraulicPressureThreshold: twin.hydraulicPressureThreshold,
                    cycleTimeMin: twin.cycleTimeMin,
                    cycleTimeMax: twin.cycleTimeMax,
                };
                console.log(this.dersiredProperties);
                this.emit("DesiredProperties", this.dersiredProperties);
            });
        });
    }
    async clientMessages() {
        this.edgeClient.open((err) => {
            this.edgeClient.on('inputMessage', (inputName, msg) => {
                const messagePayload = msg.getBytes().toString();
                const jsonObject = JSON.parse(messagePayload);
                const { tag, value, timestamp } = jsonObject;
                this.emit("MqttData", messagePayload);
            });
        });
    }
    messaging(msg) {
        this.edgeClient.sendOutputEvent("edgeMessageOuput", new azure_iot_device_1.Message(msg));
    }
}
exports.default = iotHubMessages;
;
