'use strict';

const { Device } = require('homey');

const MOTION_MOUNT_SERVICE_UUID = '3e6fe65ded7811e4895e00026fd5c52c';
const MOTION_MOUNT_SET_POSITION_CHARACTERISTIC_UUID = 'c005fa2106514800b000000000000000';

class MotionMountDevice extends Device {

  async onInit() {
    this.registerCapabilityListener('list', async (value) => this.moveToPosition(value));
  }

  async moveToPosition(position) {
    this.log(`Moving to position preset: ${position}`);
    const positionPresents = [
      {
        value: 'wall',
        hexPosition: '00000000',
      },
      {
        value: 'right',
        hexPosition: '0032ffd3',
      },
      {
        value: 'left',
        hexPosition: '00290021',
      },
    ];
    const { hexPosition } = positionPresents.find((preset) => preset.value === position);

    const advertisement = await this.homey.ble.find(this.getStore().peripheralUuid);
    const peripheral = await advertisement.connect();
    const services = await peripheral.discoverServices();
    const dataService = services.find(({ uuid }) => uuid === MOTION_MOUNT_SERVICE_UUID);
    const dataCharacteristics = await dataService.discoverCharacteristics();
    const positionCharacteristic = dataCharacteristics.find(({ uuid }) => uuid === MOTION_MOUNT_SET_POSITION_CHARACTERISTIC_UUID);

    await positionCharacteristic.write(Buffer.from(hexPosition, 'hex'), true);
  }

}

module.exports = MotionMountDevice;
