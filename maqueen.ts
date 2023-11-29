


//% weight=100 color=#6476fd icon="\uf136" block="MotionKit"
namespace maqueen {

    export enum DistanceUnit {
        //% blockId=maqueen_DistanceUnitCentimeters block="cm"
        Centimeters,
    }

    export enum Servos {
        //% blockId="maqueen_ServoS1" block="S1"
        S1 = 0,
        //% blockId="maqueen_ServoS2" block="S2"
        S2 = 1
    }

    export enum Motors {
        //% blockId="maqueen_MotorLeft" block="links"
        M1 = 0,
        //% blockId="maqueen_MotorRight" block="rechts"
        M2 = 1,
        //% blockId="maqueen_MotorAll" block="beide"
        All = 2
    }

    export enum Dir {
        //% blockId="maqueen_DirCW" block="vorwärts"
        CW = 0,
        //% blockId="maqueen_DirCCW" block="rückwärts"
        CCW = 1
    }

    export enum Led {
        //% blockId="maqueen_LedLeft" block="links"
        LedLeft = 0,
        //% blockId="maqueen_LedRight" block="rechts"
        LedRight = 1,
        //% blockId="maqueen_LedAll" block="beide"
        LedAll = 2
    }

    export enum LedSwitch {
        //% blockId="maqueen_LedOn" block="AN"
        LedOn = 1,
        //% blockId="maqueen_LedOff" block="AUS"
        LedOff = 0
    }

    export enum Patrol {
        //% blockId="maqueen_PatrolLeft" block="links"
        PatrolLeft = 0,
        //% blockId="maqueen_PatrolRight" block="rechts"
        PatrolRight = 1
    }

    export enum Voltage {
        //% blockId="maqueen_High" block="high"
        High = 1,
        //% blockId="maqueen_Low"block="low"
        Low = 0
    }

    
    const IICADRRESS = 0x10;

    let irFlag = 0;
    let ltFlag = 0;
    let ltStatus = 0;

    let irCallback: (message: number) => void = null;
    let ltCallback: Action = null;


    /**
     * Read ultrasonic sensor.
     */

    //% weight=95
    //% blockId=maqueen_ultrasonic block="Ultraschallsensor |%unit "
    export function ultrasonic(unit: DistanceUnit, maxCmDistance = 500): number {
        let integer = readData(0x28, 2);
        let distance = integer[0] << 8 | integer[1];
        return (distance > 399 || distance < 1) ? -1 : distance;
    }

    /**
     * Set the Maqueen servos.
     */

    //% weight=90
    //% blockId=maqueen_servoRun block="Servo|%index|Winkel|%angle"
    //% angle.shadow="protractorPicker"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function servoRun(index: Servos, angle: number): void {
        if (index == Servos.S1) {
            writeData([0x14, angle]);
        } else if (index == Servos.S2) {
            writeData([0x15, angle]);
        } else {
            writeData([0x14, angle]);
            writeData([0x15, angle]);
        }
    }

    /**
     * Set the direction and speed of Maqueen motor.
     */

    //% weight=85
    //% blockId=maqueen_motorRun block="Motor|%index|Richtung|%direction|Tempo|%speed"
    //% speed.min=0 speed.max=255 speed.defl=200
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        if (index == Motors.M1){
            writeData([0x00, direction, speed]);
        } else if (index == Motors.M2) {
            writeData([0x02, direction, speed]);
        } else {
            writeData([0x00, direction, speed]);
            writeData([0x02, direction, speed]);
        }
    }

    /**
     * Stop the Maqueen motor.
     */

    //% weight=80
    //% blockId=maqueen_motorStop block="Motor |%motors anhalten"
    //% motors.fieldEditor="gridpicker" motors.fieldOptions.columns=2 
    export function motorStop(index: Motors): void {
        if (index == Motors.M1) {
            writeData([0x00, 0, 0]);
        } else if (index == Motors.M2) {
            writeData([0x02, 0, 0]);
        } else {
            writeData([0x00, 0, 0]);
            writeData([0x02, 0, 0]);
        }
    }

    /**
     * Turn on/off the LEDs.
     */

    //% weight=75
    //% blockId=maqueen_writeLED block="LED |%led |%ledswitch"
    //% led.fieldEditor="gridpicker" led.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(led: Led, ledswitch: LedSwitch): void {
        if (led == Led.LedLeft) {
            writeData([0x0B, ledswitch]);
        } else if (led == Led.LedRight) {
            writeData([0x0C, ledswitch]);
        } else {
            writeData([0x0B, ledswitch]);
            writeData([0x0C, ledswitch]);
        }
    }

    //% weight=74
    //% blockId=maqueen_setColor block="RGB-LED |%color"
    //% color.shadow="colorNumberPicker"
    export function setColor(color: number): void {
        writeData([0x18, (color >> 16) & 0xff ]);
        writeData([0x19, (color >> 8) & 0xff]);
        writeData([0x1A, color & 0xff]);
    }

    //% weight=73
    //% blockId=maqueen_setRgb block="rot |%red grün |%green blau |%blue"
    //% red.min=0 red.max=255 red.defl=200
    //% green.min=0 green.max=255 green.defl=200
    //% blue.min=0 blue.max=255 blue.defl=200
    //% advanced=true
    export function setRgb(red: number, green: number, blue: number): number {
        return (red << 16) + (green << 8) + (blue);
    }

    /**
     * Read line tracking sensor.
     */

    //% weight=70
    //% blockId=maqueen_readPatrol block="Linienfolger|%patrol Status"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        let data = readData(0x1D, 1)[0];
        if (patrol == Patrol.PatrolLeft) {
            return (data & 0x01) === 0 ? 0 : 1;
        } else if (patrol == Patrol.PatrolRight) {
            return (data & 0x02) === 0 ? 0 : 1;
        } else {
            return data;
        }
    }

    /**
     * Read the version number.
     */

    //% weight=65
    //% blockId=maqueen_getVersion block="Versionsnummer"
    //% deprecated=true
    export function getVersion(): string {
        let dataLen = readData(0x32, 1)[0];
        let buf = readData(0x33, dataLen);
        let version = "";
        for (let index = 0; index < dataLen; index++) {
            version += String.fromCharCode(buf[index])
        }
        return version;
    }

    /**
     * Line tracking sensor event function
     */

    //% weight=60
    //% blockId=maqueen_ltEvent block="an|%value Linienfolger|%vi"
    //% advanced=true
    //% deprecated=true
    export function ltEvent(value: Patrol, vi: Voltage, ltcb: Action) {
        ltFlag = 1;
        ltCallback = ltcb;
        if (value == Patrol.PatrolLeft){
            if (vi == Voltage.High) {
                ltStatus = 0x11;
            } else {
                ltStatus = 0x12;
            }
        } else {
            if (vi == Voltage.High) {
                ltStatus = 0x13;
            } else {
                ltStatus = 0x14;
            }
        } 
    }

    /**
     * Get the value of the infrared sensor
     */

    //% weight=55
    //% blockId=maqueen_irRead block="IR Wert"
    export function irRead(): number {
        let buf = readData(0x2B, 4);
        let data = buf[3] | (buf[2] << 8) | (buf[1] << 16) | (buf[0] << 24);
        return irKeyValueConversion(data);
    }

    /**
     * Infrared sensor event function
     */

    //% weight=50
    //% blockId=maqueen_irEvent block="Wenn IR empfangen"
    //% draggableParameters
    //% advanced=true
    export function irEvent(ircb: (message: number) => void) {
        irFlag = 1;
        irCallback = ircb;
    }

    function readData(reg: number, len: number): Buffer{
        pins.i2cWriteNumber(IICADRRESS, reg, NumberFormat.UInt8BE);
        return pins.i2cReadBuffer(IICADRRESS, len, false);
    }

    function writeData(buf: number[]): void {
        pins.i2cWriteBuffer(IICADRRESS, pins.createBufferFromArray(buf));
    }

    function irKeyValueConversion(data: number): number {
        let data1 = 0;
        switch (data) {
            case 0xFD00FF: data1 = 0; break;
            case 0xFD807F: data1 = 1; break;
            case 0xFD40BF: data1 = 2; break;
            case 0xFD20DF: data1 = 4; break;
            case 0xFDA05F: data1 = 5; break;
            case 0xFD609F: data1 = 6; break;
            case 0xFD10EF: data1 = 8; break;
            case 0xFD906F: data1 = 9; break;
            case 0xFD50AF: data1 = 10; break;
            case 0xFD30CF: data1 = 12; break;
            case 0xFDB04F: data1 = 13; break;
            case 0xFD708F: data1 = 14; break;
            case 0xFD08F7: data1 = 16; break;
            case 0xFD8877: data1 = 17; break;
            case 0xFD48B7: data1 = 18; break;
            case 0xFD28D7: data1 = 20; break;
            case 0xFDA857: data1 = 21; break;
            case 0xFD6897: data1 = 22; break;
            case 0xFD18E7: data1 = 24; break;
            case 0xFD9867: data1 = 25; break;
            case 0xFD58A7: data1 = 26; break;
            case 0: data1 = -1; break;
            default: data1 = data & 0xff; break;
        }
        return data1;
    }

    basic.forever(() => {
        if (irFlag == 1) {
            let buf = readData(0x2B, 4);
            let data = buf[3] | (buf[2] << 8) | (buf[1] << 16) | (buf[0] << 24);
            if (data != 0){
                irCallback(irKeyValueConversion(data));
            }
        }
        if (ltFlag == 1) {
            let data = readData(0x1D, 1)[0];
            switch(ltStatus) {
                case 0x11: if(data & 0x01) { ltCallback();break }
                case 0x12: if(!(data & 0x01)) { ltCallback(); break }
                case 0x13: if (data & 0x02) { ltCallback(); break }
                case 0x14: if (!(data & 0x02)) { ltCallback(); break }
            }
        }
        basic.pause(100);
    })
}