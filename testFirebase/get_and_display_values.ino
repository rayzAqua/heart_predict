/*
  MAX3010 Breakout: Read the onboard temperature sensor
  By: Nathan Seidle @ SparkFun Electronics
  Date: October 20th, 2016
  https://github.com/sparkfun/MAX30105_Breakout

  This demo outputs the onboard temperature sensor. The temp sensor is accurate to +/-1 C but
  has an astonishing precision of 0.0625 C.

  Hardware Connections (Breakoutboard to Arduino):
  -5V = 5V (3.3V is allowed)
  -GND = GND
  -SDA = A4 (or SDA)
  -SCL = A5 (or SCL)
  -INT = Not connected
 
  The MAX30105 Breakout can handle 5V or 3.3V I2C logic. We recommend powering the board with 5V
  but it will also run at 3.3V.
*/

#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include "heartRate.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define REPORTING_PERIOD_MS 1000

#define SCREEN_WIDTH 128 // Chiều rộng màn hình OLED
#define SCREEN_HEIGHT 32 // Chiều cao màn hình OLED

PulseOximeter pox;
MAX30100 sensor;


Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

uint32_t tsLastReport = 0;
void onBeatDetected(){
    Serial.println("Beat!");
}

void setup()
{
  Serial.begin(9600);
  Serial.println("Initializing...");
  // Initialize oled
  while(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("OLED was not found !"));    
  }
  // Xóa màn hình OLED
  display.clearDisplay();
  display.display();
  // Initialize sensor
  while (!sensor.begin()) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30100 was not found! ");    
  }
  while (!pox.begin()) //Use default I2C port, 400kHz speed
  {
    Serial.println("PulseOximeter was not found!");    
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");
  configureMax30100();
}
void loop()
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  sensor.update();
  if(millis() - tsLastReport > REPORTING_PERIOD_MS ){    
    displaySerial();
    tsLastReport = millis();
  }
}
void configureMax30100() {
  sensor.setMode(MAX30100_MODE_SPO2_HR);
  sensor.setLedsCurrent(MAX30100_LED_CURR_50MA, MAX30100_LED_CURR_27_1MA);
  sensor.setLedsPulseWidth(MAX30100_SPC_PW_1600US_16BITS);
  sensor.setSamplingRate(MAX30100_SAMPRATE_100HZ);
  sensor.setHighresModeEnabled(true);
}
void displayOled(){
  display.setCursor(0, 0);
  display.print("Nhip tim: ");
  display.print(pox.getHeartRate(),0);
  display.println(" bpm");
  display.setCursor(0, 12);        
  display.print("Nhiet do: ");
  sensor.startTemperatureSampling();
  if (sensor.isTemperatureReady()) {
    float temp = sensor.retrieveTemperature();
    display.print(temp,1);
    display.println("*C");
  }
  display.setCursor(0, 24);
  display.print("Nong do oxy: ");
  display.print(pox.getSpO2());
  display.println(" %");
}
void displaySerial(){
  Serial.print("Heart rate:");
  Serial.print(pox.getHeartRate(),0);
  Serial.print("bpm / SpO2:");
  Serial.print(pox.getSpO2());
  Serial.print("%, temp: ");
  if (sensor.isTemperatureReady()) {
    float temp = sensor.retrieveTemperature();
    Serial.print(temp,1);
    Serial.println(" *C");
  }
}  

