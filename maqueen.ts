//% weight=100 color=#6476fd icon="\uf0e7" block="MotionKit"
namespace maqueen {
    export enum DistanceUnit {
        //% blockId=maqueen_DistanceUnitCentimeters block="cm" block.loc.de="cm" block.loc.fr="cm" block.loc.es="cm" block.loc.it="cm" block.loc.el="cm"
        Centimeters,
    }

    export enum Servos {
        //% blockId="maqueen_ServoS1" block="S1" block.loc.de="S1" block.loc.fr="S1" block.loc.es="S1" block.loc.it="S1" block.loc.el="S1"
        S1 = 0,
        //% blockId="maqueen_ServoS2" block="S2" block.loc.de="S2" block.loc.fr="S2" block.loc.es="S2" block.loc.it="S2" block.loc.el="S2"
        S2 = 1
    }

    export enum Motors {
        //% blockId="maqueen_MotorLeft" block="left" block.loc.de="links" block.loc.fr="gauche" block.loc.es="izquierda" block.loc.it="sinistra" block.loc.el="αριστερά"
        M1 = 0,
        //% blockId="maqueen_MotorRight" block="right" block.loc.de="rechts" block.loc.fr="droite" block.loc.es="derecha" block.loc.it="destra" block.loc.el="δεξιά"
        M2 = 1,
        //% blockId="maqueen_MotorAll" block="both" block.loc.de="beide" block.loc.fr="les deux" block.loc.es="ambos" block.loc.it="entrambi" block.loc.el="και τα δύο"
        All = 2
    }

    export enum Dir {
        //% blockId="maqueen_DirCW" block="forward" block.loc.de="vorwärts" block.loc.fr="avant" block.loc.es="adelante" block.loc.it="avanti" block.loc.el="μπροστά"
        CW = 0,
        //% blockId="maqueen_DirCCW" block="backwards" block.loc.de="rückwärts" block.loc.fr="arrière" block.loc.es="atrás" block.loc.it="indietro" block.loc.el="πίσω"
        CCW = 1
    }

    export enum Led {
        //% blockId="maqueen_LedLeft" block="left" block.loc.de="links" block.loc.fr="gauche" block.loc.es="izquierda" block.loc.it="sinistra" block.loc.el="αριστερά"
        LedLeft = 0,
        //% blockId="maqueen_LedRight" block="right" block.loc.de="rechts" block.loc.fr="droite" block.loc.es="derecha" block.loc.it="destra" block.loc.el="δεξιά"
        LedRight = 1,
        //% blockId="maqueen_LedAll" block="both" block.loc.de="beide" block.loc.fr="les deux" block.loc.es="ambos" block.loc.it="entrambi" block.loc.el="και τα δύο"
        LedAll = 2
    }

    export enum LedSwitch {
        //% blockId="maqueen_LedOn" block="ON" block.loc.de="AN" block.loc.fr="ALLUMÉ" block.loc.es="ENCENDIDO" block.loc.it="ACCESO" block.loc.el="ΑΝΟΙΧΤΟ"
        LedOn = 1,
        //% blockId="maqueen_LedOff" block="OFF" block.loc.de="AUS" block.loc.fr="ÉTEINT" block.loc.es="APAGADO" block.loc.it="SPENTO" block.loc.el="ΚΛΕΙΣΤΟ"
        LedOff = 0
    }

    export enum Patrol {
        //% blockId="maqueen_PatrolLeft" block="left" block.loc.de="links" block.loc.fr="gauche" block.loc.es="izquierda" block.loc.it="sinistra" block.loc.el="αριστερά"
        PatrolLeft = 0,
        //% blockId="maqueen_PatrolRight" block="right" block.loc.de="rechts" block.loc.fr="droite" block.loc.es="derecha" block.loc.it="destra" block.loc.el="δεξιά"
        PatrolRight = 1
    }

    export enum Voltage {
        //% blockId="maqueen_High" block="high" block.loc.de="hoch" block.loc.fr="haut" block.loc.es="alto" block.loc.it="alto" block.loc.el="ψηλά"
        High = 1,
        //% blockId="maqueen_Low" block="low" block.loc.de="niedrig" block.loc.fr="bas" block.loc.es="bajo" block.loc.it="basso" block.loc.el="χαμηλά"
        Low = 0
    }

    export enum Brightness {
        //% blockId="maqueen_Bright" block="bright" block.loc.de="hell" block.loc.fr="clair" block.loc.es="brillante" block.loc.it="luminoso" block.loc.el="φωτεινό"
        Bright = 0,
        //% blockId="maqueen_Dark" block="dark" block.loc.de="dunkel" block.loc.fr="sombre" block.loc.es="oscuro" block.loc.it="scuro" block.loc.el="σκοτεινό"
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
    //% blockId=maqueen_ultrasonic block="Ultrasonic |%unit"
    //% block.loc.de="Ultraschallsensor |%unit"
    //% block.loc.fr="Capteur à ultrasons |%unit"
    //% block.loc.es="Sensor ultrasónico |%unit"
    //% block.loc.it="Sensore ultrasonico |%unit"
    //% block.loc.el="Αισθητήρας υπερήχων |%unit"
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
    //% blockId=maqueen_servoRun block="Servo |%index| Angle |%angle"
    //% block.loc.de="Servo |%index| Winkel |%angle"
    //% block.loc.fr="Servo |%index| Angle |%angle"
    //% block.loc.es="Servo |%index| Ángulo |%angle"
    //% block.loc.it="Servo |%index| Angolo |%angle"
    //% block.loc.el="Σέρβο |%index| Γωνία |%angle"
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
    //% blockId=maqueen_motorRun block="Motor |%index| Direction |%direction| Speed |%speed"
    //% block.loc.de="Motor |%index| Richtung |%direction| Tempo |%speed"
    //% block.loc.fr="Moteur |%index| Direction |%direction| Vitesse |%speed"
    //% block.loc.es="Motor |%index| Dirección |%direction| Velocidad |%speed"
    //% block.loc.it="Motore |%index| Direzione |%direction| Velocità |%speed"
    //% block.loc.el="Κινητήρας |%index| Κατεύθυνση |%direction| Ταχύτητα |%speed"
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
    //% blockId=maqueen_motorStop block="Motors |%motors stop"
    //% block.loc.de="Motor |%motors anhalten"
    //% block.loc.fr="Arrêter le moteur |%motors"
    //% block.loc.es="Detener el motor |%motors"
    //% block.loc.it="Ferma il motore |%motors"
    //% block.loc.el="Σταμάτησε τον κινητήρα |%motors"
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
    //% block.loc.de="LED |%led |%ledswitch"
    //% block.loc.fr="LED |%led |%ledswitch"
    //% block.loc.es="LED |%led |%ledswitch"
    //% block.loc.it="LED |%led |%ledswitch"
    //% block.loc.el="LED |%led |%ledswitch"
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
    //% block.loc.de="RGB-LED |%color"
    //% block.loc.fr="LED RGB |%color"
    //% block.loc.es="LED RGB |%color"
    //% block.loc.it="LED RGB |%color"
    //% block.loc.el="LED RGB |%color"
    //% color.shadow="colorNumberPicker"
    export function setColor(color: number): void {
        writeData([0x18, (color >> 16) & 0xff ]);
        writeData([0x19, (color >> 8) & 0xff]);
        writeData([0x1A, color & 0xff]);
    }

    //% weight=73
    //% blockId=maqueen_setRgb block="ref |%red green |%green blue |%blue"
    //% block.loc.de="rot |%red grün |%green blau |%blue"
    //% block.loc.fr="rouge |%red vert |%green bleu |%blue"
    //% block.loc.es="rojo |%red verde |%green azul |%blue"
    //% block.loc.it="rosso |%red verde |%green blu |%blue"
    //% block.loc.el="κόκκινο |%red πράσινο |%green μπλε |%blue"
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
    //% blockId=maqueen_readPatrol block="Linefinder %patrol %brightness"
    //% block.loc.de="Liniensensor %patrol %brightness"
    //% block.loc.fr="Capteur de suivi de ligne %patrol %brightness"
    //% block.loc.es="Sensor de seguimiento de línea %patrol %brightness"
    //% block.loc.it="Sensore di tracciamento linea %patrol %brightness"
    //% block.loc.el="Αισθητήρας εντοπισμού γραμμής %patrol %brightness"
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
    //% blockId=maqueen_getVersion block="Version number"
    //% block.loc.de="Versionsnummer"
    //% block.loc.fr="Numéro de version"
    //% block.loc.es="Número de versión"
    //% block.loc.it="Numero di versione"
    //% block.loc.el="Αριθμός έκδοσης"
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
    //% blockId=maqueen_ltEvent block="on |%value Linefinder |%vi"
    //% block.loc.de="an |%value Linienfolger |%vi"
    //% block.loc.fr="sur |%value suiveur de ligne |%vi"
    //% block.loc.es="en |%value seguidor de línea |%vi"
    //% block.loc.it="su |%value seguilinea |%vi"
    //% block.loc.el="σε |%value ακολουθητής γραμμής |%vi"
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
    //% blockId=maqueen_irRead block="IR Value"
    //% block.loc.de="IR Wert"
    //% block.loc.fr="Valeur IR"
    //% block.loc.es="Valor IR"
    //% block.loc.it="Valore IR"
    //% block.loc.el="Τιμή IR"
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
    //% block.loc.de="Wenn IR empfangen"
    //% block.loc.fr="Quand IR reçu"
    //% block.loc.es="Cuando IR recibido"
    //% block.loc.it="Quando IR ricevuto"
    //% block.loc.el="Όταν ληφθεί IR"
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
