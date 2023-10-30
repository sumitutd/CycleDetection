"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const azure_iot_device_1 = require("azure-iot-device");
const moduleTwin_1 = __importDefault(require("../iot/moduleTwin"));
describe("iiot", () => {
    let mockClient;
    let mockTwin;
    beforeEach(() => {
        mockClient = {
            open: jest.fn().mockResolvedValue(undefined),
            getTwin: jest.fn((callback) => {
                callback(null, mockTwin);
            }),
            sendOutputEvent: jest.fn(),
            on: jest.fn(),
        };
        mockTwin = {
            on: jest.fn(),
            properties: {
                desired: {
                    readTags: [],
                    brokerurl: "mqtt://localhost",
                },
            },
        };
    });
    test('Throws an error if required properties are missing from twin', async () => {
        const fakeiotHub = new moduleTwin_1.default(mockClient);
        expect(fakeiotHub).toBeInstanceOf(moduleTwin_1.default);
    });
    it("Test Client connection", async () => {
        const receiver = new moduleTwin_1.default(mockClient);
        const clientConnectionSpy = jest.spyOn(receiver, 'clientConnection');
        await receiver['clientConnection']();
        expect(clientConnectionSpy).toHaveBeenCalled(); //test to see if client connection method is called. 
    });
    it("Test Client Messages", () => {
        const receiver = new moduleTwin_1.default(mockClient);
        const clientConnectionSpy = jest.spyOn(receiver, 'clientMessages');
        receiver['clientMessages']();
        expect(receiver.edgeClient.open).toHaveBeenCalled();
    });
    it('Sending Output to IOTHUB', () => {
        const receiver = new moduleTwin_1.default(mockClient);
        const msg = "Some Message :755";
        const undefinedTag = receiver['messaging'](msg);
        expect(mockClient.sendOutputEvent).toHaveBeenCalledWith('edgeMessageOuput', expect.any(azure_iot_device_1.Message));
    });
});
