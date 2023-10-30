import { Message } from 'azure-iot-device';
import iotHubMessages from '../iot/moduleTwin';


describe("iiot", () => {

  let mockClient: any;
  let mockTwin: any;

  beforeEach(() => {

    mockClient = {
      open: jest.fn().mockResolvedValue(undefined),
      getTwin: jest.fn((callback) => {
        
        callback(null, mockTwin);
      }),
      sendOutputEvent: jest.fn(),
      on:jest.fn(),
  
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

      const fakeiotHub = new iotHubMessages(mockClient);

      expect(fakeiotHub).toBeInstanceOf(iotHubMessages);
 
  });

  it("Test Client connection",async()=>{

    const receiver = new iotHubMessages(mockClient);

    const clientConnectionSpy = jest.spyOn(receiver as any, 'clientConnection');

    await receiver['clientConnection']();

    expect(clientConnectionSpy).toHaveBeenCalled();//test to see if client connection method is called. 

  })

  it("Test Client Messages",()=>{

    const receiver = new iotHubMessages(mockClient);

    const clientConnectionSpy = jest.spyOn(receiver as any, 'clientMessages');

    receiver['clientMessages']();
  
    expect(receiver.edgeClient.open).toHaveBeenCalled()
   

  })

  it('Sending Output to IOTHUB',()=>{

    const receiver = new iotHubMessages(mockClient);

    const msg = "Some Message :755";

    const undefinedTag = receiver['messaging'](msg);

    expect(mockClient.sendOutputEvent).toHaveBeenCalledWith(
      'edgeMessageOuput', 
      expect.any(Message)
    );


  })

})
