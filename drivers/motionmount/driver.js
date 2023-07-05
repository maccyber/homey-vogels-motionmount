'use strict';

const { Driver } = require('homey');

const MOTION_MOUNT_LOCAL_NAME = "Vogel's MotionMount";

class MotionMountDriver extends Driver {

  async onPairListDevices() {
    const advertisements = await this.homey.ble.discover();

    return advertisements
      .filter((advertisement) => advertisement.localName === MOTION_MOUNT_LOCAL_NAME)
      .map((advertisement) => {
        return {
          name: advertisement.localName,
          data: {
            id: advertisement.uuid,
          },
          store: {
            peripheralUuid: advertisement.uuid,
          },
        };
      });
  }

}

module.exports = MotionMountDriver;
