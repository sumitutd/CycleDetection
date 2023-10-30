import { CycleManager } from './iot/cycles';
import { ModuleClient as Client} from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt'; 
import iotHubMessages from "./iot/moduleTwin";


async function initializeReceiver() {
  
  const edgeClient = await Client.fromEnvironment(Mqtt);

  const iotHub = new iotHubMessages(edgeClient);

  const cycleManager = new CycleManager();

  iotHub.on("DesiredProperties", (msg) => {

    cycleManager.moduleTwin(msg);

  });

  iotHub.on("MqttData", (msg) => {

    cycleManager.main(msg);

  });

  cycleManager.on("Cycle Event", (msg) => { 

    iotHub.messaging(msg);

  })

  }
  
  initializeReceiver().catch(error => {

    console.error('Error initializing Receiver:', error);

  });

  