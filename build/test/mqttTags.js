"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttManager = void 0;
const mqtt = __importStar(require("mqtt"));
const events_1 = require("events");
class MqttManager extends events_1.EventEmitter {
    brokerUrl;
    client;
    tagData = null; // Initialize as null
    constructor(brokerUrl) {
        super();
        this.brokerUrl = brokerUrl;
        this.client = mqtt.connect(brokerUrl);
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });
        this.client.on('message', (topic, message) => {
            const msg = message.toString();
            this.tagData = {
                tag: topic,
                timestamp: new Date().toISOString(),
                value: parseInt(msg),
            };
            this.emit('tagData', this.tagData);
        });
    }
    subscribe(topic) {
        this.client.subscribe(topic, (error) => {
            if (error) {
                console.error(`Error subscribing to ${topic}: ${error}`);
            }
            else {
                console.log("Succesfully subscribed to ", topic);
            }
        });
    }
    publish(topic, message) {
        this.client.publish(topic, message, (error) => {
            if (error) {
                console.error(`Error publishing message: ${error}`);
            }
            else {
                return message;
            }
        });
    }
    disconnect() {
        this.client.end(false, () => {
            console.log('Disconnected from MQTT broker');
        });
    }
}
exports.default = MqttManager;
const readTags = [
    {
        "tagName": "HydraullicPressure",
        "topic": "revpi/event/HydraullicPressure"
    },
    {
        "tagName": "EjectDoorSignal",
        "topic": "revpi/event/EjectDoorSignal"
    },
    {
        "tagName": "RamMoving",
        "topic": "revpi/event/RamMoving"
    },
    {
        "tagName": "RamAtDoor",
        "topic": "revpi/event/RamAtDoor"
    },
    {
        "tagName": "Power",
        "topic": "revpi/event/Power"
    },
];
exports.mqttManager = new MqttManager("mqtt://10.10.208.49:1883");
readTags.forEach((tag) => {
    exports.mqttManager.subscribe(tag.topic);
});
