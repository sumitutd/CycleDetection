import {ModuleClient as Client, Message, ModuleClient,Twin} from "azure-iot-device";
import { EventEmitter } from 'events';
import { desiredTwin } from "./assets";

export default class iotHubMessages extends EventEmitter {

    private dersiredProperties!: desiredTwin;
  
    constructor(readonly edgeClient: Client) {
  
        super();

        this.clientConnection();

        this.clientMessages();

    }
  
    private async clientConnection() {
  
      await this.edgeClient.open();
  
      this.edgeClient.getTwin((err, twin:any) => {

        twin?.on("properties.desired", (twin: any) => {

            console.log("Desired properties have been updated to: ", twin);
            
            this.dersiredProperties = {
                hydraulicPressureThreshold: twin.hydraulicPressureThreshold,
                cycleTimeMin: twin.cycleTimeMin,
                cycleTimeMax: twin.cycleTimeMax,
            };

            console.log(this.dersiredProperties)

            this.emit("DesiredProperties", this.dersiredProperties);

            })    

        });

    }
  
    private async clientMessages() {

        this.edgeClient.open((err)=> {

            this.edgeClient.on('inputMessage', (inputName: string,msg: {getBytes: () => { (): any; new(): any; toString: { (): any; new(): any; }; }; }) => {

                const messagePayload = msg.getBytes().toString();
                const jsonObject = JSON.parse(messagePayload);
                const { tag, value, timestamp } = jsonObject;
                this.emit("MqttData", messagePayload);
        
            })
            
        })
       
    }
  
    public messaging(msg:any) {
  
        this.edgeClient.sendOutputEvent(
          "edgeMessageOuput",
          new Message(msg)
        );   
    }
};
  
  
  