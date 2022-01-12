import * as microbit from 'microbit-web-bluetooth';

const logEl = document.getElementById('log');
const log = (message) => (logEl.innerHTML = `${message}\n${logEl.innerHTML}`);
const logJson = (message) => log(JSON.stringify(message, null, 2));
const eventHandler = (event) => log(`${event.type}: ${JSON.stringify(event.detail, null, 2)}`);
window.onload = () => {
    document.getElementById('find').addEventListener('click', async () => {
        const device = await microbit.requestMicrobit(window.navigator.bluetooth);
        if (device) {
            const services = await microbit.getServices(device);
            console.log(services);

            if (services.deviceInformationService) {
                logJson(await services.deviceInformationService.readDeviceInformation());
            }

            if (services.ioPinService) {
                logJson('ioPinServices');
                const Ad_char = 'e95d5899-251d-470a-a062-fa1922dfa9a8';
                const Io_char = 'e95db9fe-251d-470a-a062-fa1922dfa9a8';
                let cmd = new Uint32Array([0x02]);
                services.ioPinService.helper.setCharacteristicValue(Io_char, cmd);
                services.ioPinService.helper.setCharacteristicValue(Ad_char, cmd);
                services.ioPinService.addEventListener('pindatachanged', eventHandler);
                // services.ioPinService.send();
                let _p0 = 0;
                let _p1 = 0;
                let _p2 = 0;

                const pin_data = await services.ioPinService.readPinData();
                // let pwm = {
                //     pin: 1, // 0,1,2
                //     value: 180, // 50-250
                //     period: 10000, // 10000 microsecconds = 10 millisecconds
                // };

                // services.ioPinService.setPwmControl(pwm); //먹히긴함.

                logJson(pin_data);
                console.log(services.ioPinService);
 
            }

            if (services.uartService) {
                services.uartService.addEventListener('receiveText', eventHandler);
                await services.uartService.send(new Uint8Array([104, 101, 108, 108, 111, 58])); // hello:
                window.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowUp') {
                        services.uartService.sendText("forward:")
                    }
                    if (e.key === 'ArrowDown') {
                        services.uartService.sendText("back:")
                    }
                    if (e.key === 'ArrowLeft') {
                        services.uartService.sendText("left:")
                    }
                    if (e.key === 'ArrowRight') {
                        services.uartService.sendText("right:")
                    }
                    if (e.key === 'Enter') {
                        services.uartService.sendText("stop:")
                    }
                    console.log(e.key)
 
                });

                window.addEventListener('keyup', (e) => {

                    if (e.key === 'ArrowUp') {
                        services.uartService.sendText("stop:")

                    }
                    if (e.key === 'ArrowDown') {
                        services.uartService.sendText("stop:")
                    }
                    if (e.key === 'ArrowLeft') {
                        services.uartService.sendText("center:")
                    }
                    if (e.key === 'ArrowRight') {
                        services.uartService.sendText("center:")
                    }
                });
            }

            if (services.ledService) {
                await services.ledService.writeMatrixState([
                    [1, 0, 1, 0, 0],
                    [1, 1, 1, 1, 1],
                    [0, 0, 1, 0, 0],
                    [0, 1, 0, 1, 0],
                    [1, 0, 0, 0, 1],
                ]);
                logJson(await services.ledService.readMatrixState());

                await services.ledService.setScrollingDelay(50);
                log(await services.ledService.getScrollingDelay());

                await services.ledService.writeText('Web BLE');
            }

            if (services.buttonService) {
                //잘되는거 확인.
                services.buttonService.addEventListener('buttonastatechanged', eventHandler);
                services.buttonService.addEventListener('buttonbstatechanged', eventHandler);
            }

            if (services.temperatureService) {
                await services.temperatureService.setTemperaturePeriod(2000);
                log(await services.temperatureService.getTemperaturePeriod());
                services.temperatureService.addEventListener('temperaturechanged', eventHandler);
            }

            if (services.accelerometerService) {
                /*
      await services.accelerometerService.setAccelerometerPeriod(640);
      log(await services.accelerometerService.getAccelerometerPeriod());
      services.accelerometerService.addEventListener(
        "accelerometerdatachanged",
        eventHandler
      );
      */
            }

            if (services.magnetometerService) {
                const startMagnetometer = async () => {
                    await services.magnetometerService.setMagnetometerPeriod(640);
                    log(await services.magnetometerService.getMagnetometerPeriod());

                    services.magnetometerService.addEventListener('magnetometerdatachanged', eventHandler);
                    services.magnetometerService.addEventListener('magnetometerbearingchanged', eventHandler);
                };

                services.magnetometerService.addEventListener('magnetometercalibrationchanged', async (response) => {
                    if (response.detail === 2) {
                        await startMagnetometer();
                    }
                });

                try {
                    await services.magnetometerService.calibrate();
                } catch (e) {
                    await startMagnetometer();
                }
            }
        }
    });
};
