//% weight=100 color=#6476fd icon="\uf0e7" block="MotionKit"
namespace maqueen {
    export enum DistanceUnit {
        //% blockId=maqueen_DistanceUnitCentimeters block="cm" block.fr="cm" block.es="cm" block.it="cm" block.el="cm"
        Centimeters,
    }

    export enum Servos {
        //% blockId="maqueen_ServoS1" block="S1" block.fr="S1" block.es="S1" block.it="S1" block.el="S1"
        S1 = 0,
        //% blockId="maqueen_ServoS2" block="S2" block.fr="S2" block.es="S2" block.it="S2" block.el="S2"
        S2 = 1
    }

    export enum Motors {
        //% blockId="maqueen_MotorLeft" block="links" block.fr="gauche" block.es="izquierda" block.it="sinistra" block.el="αριστερά"
        M1 = 0,
        //% blockId="maqueen_MotorRight" block="rechts" block.fr="droite" block.es="derecha" block.it="destra" block.el="δεξιά"
        M2 = 1,
        //% blockId="maqueen_MotorAll" block="beide" block.fr="les deux" block.es="ambos" block.it="entrambi" block.el="και τα δύο"
        All = 2
    }

    export enum Dir {
        //% blockId="maqueen_DirCW" block="vorwärts" block.fr="avant" block.es="adelante" block.it="avanti" block.el="μπροστά"
        CW = 0,
        //% blockId="maqueen_DirCCW" block="rückwärts" block.fr="arrière" block.es="atrás" block.it="indietro" block.el="πίσω"
        CCW = 1
    }

    export enum Led {
        //% blockId="maqueen_LedLeft" block="links" block.fr="gauche" block.es="izquierda" block.it="sinistra" block.el="αριστερά"
        LedLeft = 0,
        //% blockId="maqueen_LedRight" block="rechts" block.fr="droite" block.es="derecha" block.it="destra" block.el="δεξιά"
        LedRight = 1,
        //% blockId="maqueen_LedAll" block="beide" block.fr="les deux" block.es="ambos" block.it="entrambi" block.el="και τα δύο"
        LedAll = 2
    }

    export enum LedSwitch {
        //% blockId="maqueen_LedOn" block="AN" block.fr="ALLUMÉ" block.es="ENCENDIDO" block.it="ACCESO" block.el="ΑΝΟΙΧΤΟ"
        LedOn = 1,
        //% blockId="maqueen_LedOff" block="AUS" block.fr="ÉTEINT" block.es="APAGADO" block.it="SPENTO" block.el="ΚΛΕΙΣΤΟ"
        LedOff = 0
    }

    export enum Patrol {
        //% blockId="maqueen_PatrolLeft" block="links" block.fr="gauche" block.es="izquierda" block.it="sinistra" block.el="αριστερά"
        PatrolLeft = 0,
        //% blockId="maqueen_PatrolRight" block="rechts" block.fr="droite" block.es="derecha" block.it="destra" block.el="δεξιά"
        PatrolRight = 1
    }

    export enum Voltage {
        //% blockId="maqueen_High" block="high" block.fr="haut" block.es="alto" block.it="alto" block.el="ψηλά"
        High = 1,
        //% blockId="maqueen_Low" block="low" block.fr="bas" block.es="bajo" block.it="basso" block.el="χαμηλά"
        Low = 0
    }

    export enum Brightness {
        //% blockId="maqueen_Bright" block="hell" block.fr="clair" block.es="brillante" block.it="luminoso" block.el="φωτεινό"
        Bright = 0,
        //% blockId="maqueen_Dark" block="dunkel" block.fr="sombre" block.es="oscuro" block.it="scuro" block.el="σκοτεινό"
        Dark = 1
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
    //% blockId=maqueen_ultrasonic block="Ultraschallsensor |%unit"
    //% block.fr="Capteur à ultrasons |%unit"
    //% block.es="Sensor ultrasónico |%unit"
    //% block.it="Sensore ultrasonico |%unit"
    //% block.el="Αισθητήρας υπερήχων |%unit"
    export function ultrasonic(unit: DistanceUnit, maxCmDistance = 500): number {
        let integer = readData(0x28, 2);
        let distance = integer[0] << 8 | integer[1];
        if (distance > 399) {
            return 400; // Return maximum value
        }
        if (distance < 1) {
            return -1; // Returns -1 if distance is invalid
        }
        return distance;
    }

    /**
     * Set the Maqueen servos.
     */
    //% weight=90
    //% blockId=maqueen_servoRun block="Servo |%index| Winkel |%angle"
    //% block.fr="Servo |%index| Angle |%angle"
    //% block.es="Servo |%index| Ángulo |%angle"
    //% block.it="Servo |%index| Angolo |%angle"
    //% block.el="Σέρβο |%index| Γωνία |%angle"
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
    //% blockId=maqueen_motorRun block="Motor |%index| Richtung |%direction| Tempo |%speed"
    //% block.fr="Moteur |%index| Direction |%direction| Vitesse |%speed"
    //% block.es="Motor |%index| Dirección |%direction| Velocidad |%speed"
    //% block.it="Motore |%index| Direzione |%direction| Velocità |%speed"
    //% block.el="Κινητήρας |%index| Κατεύθυνση |%direction| Ταχύτητα |%speed"
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
    //% block.fr="Arrêter le moteur |%motors"
    //% block.es="Detener el motor |%motors"
    //% block.it="Ferma il motore |%motors"
    //% block.el="Σταμάτησε τον κινητήρα |%motors"
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
    //% block.fr="LED |%led |%ledswitch"
    //% block.es="LED |%led |%ledswitch"
    //% block.it="LED |%led |%ledswitch"
    //% block.el="LED |%led |%ledswitch"
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
    //% block.fr="LED RGB |%color"
    //% block.es="LED RGB |%color"
    //% block.it="LED RGB |%color"
    //% block.el="LED RGB |%color"
    //% color.shadow="colorNumberPicker"
    export function setColor(color: number): void {
        writeData([0x18, (color >> 16) & 0xff ]);
        writeData([0x19, (color >> 8) & 0xff]);
        writeData([0x1A, color & 0xff]);
    }

    //% weight=73
    //% blockId=maqueen_setRgb block="rot |%red grün |%green blau |%blue"
    //% block.fr="rouge |%red vert |%green bleu |%blue"
    //% block.es="rojo |%red verde |%green azul |%blue"
    //% block.it="rosso |%red verde |%green blu |%blue"
    //% block.el="κόκκινο |%red πράσινο |%green μπλε |%blue"
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
    //% blockId=maqueen_readPatrol block="Liniensensor %patrol %brightness"
    //% block.fr="Capteur de suivi de ligne %patrol %brightness"
    //% block.es="Sensor de seguimiento de línea %patrol %brightness"
    //% block.it="Sensore di tracciamento linea %patrol %brightness"
    //% block.el="Αισθητήρας εντοπισμού γραμμής %patrol %brightness"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2
    //% brightness.fieldEditor="gridpicker" brightness.fieldOptions.columns=2
    export function readPatrol(patrol: Patrol, brightness: Brightness): boolean {
        let data = readData(0x1D, 1)[0];
        let sensorValue = 0;

        if (patrol == Patrol.PatrolLeft) {
            sensorValue = (data & 0x01) === 0 ? 0 : 1;
        } else if (patrol == Patrol.PatrolRight) {
            sensorValue = (data & 0x02) === 0 ? 0 : 1;
        }

        return brightness == Brightness.Bright ? sensorValue == 0 : sensorValue == 1;
    }

    /**
     * Read the version number.
     */
    //% weight=65
    //% blockId=maqueen_getVersion block="Versionsnummer"
    //% block.fr="Numéro de version"
    //% block.es="Número de versión"
    //% block.it="Numero di versione"
    //% block.el="Αριθμός έκδοσης"
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
    //% blockId=maqueen_ltEvent block="an |%value Linienfolger |%vi"
    //% block.fr="sur |%value suiveur de ligne |%vi"
    //% block.es="en |%value seguidor de línea |%vi"
    //% block.it="su |%value seguilinea |%vi"
    //% block.el="σε |%value ακολουθητής γραμμής |%vi"
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
    //% block.fr="Valeur IR"
    //% block.es="Valor IR"
    //% block.it="Valore IR"
    //% block.el="Τιμή IR"
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
    //% block.fr="Quand IR reçu"
    //% block.es="Cuando IR recibido"
    //% block.it="Quando IR ricevuto"
    //% block.el="Όταν ληφθεί IR"
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
