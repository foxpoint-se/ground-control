//code for arduino UNO
//use the same code to access AT-commands but connect the SET-pin of the HC-12 to ground

#include <SoftwareSerial.h>;
#define RX 2 //Connect to the TX pin of the HC-12
#define TX 3 //Connect to the RX pin of the HC-12
SoftwareSerial mySerial(RX, TX);

String serial_buffer = "";
char byte_in;

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);

}

void loop() { // run over and over

  
//  if (mySerial.available()) {
//    byte_in = mySerial.read();
//    //Serial.print(byte_in);
//    serial_buffer += (char)byte_in;
//
//    if(byte_in == "\n") {
//      Serial.print(serial_buffer);
//      serial_buffer = "";
//    }
//  }
  if (mySerial.available()) {
    Serial.write(mySerial.read());
  }
  //  if (Serial.available()) {
  //    mySerial.write(Serial.read());
  //  }
}
