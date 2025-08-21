# io box

Universal box with ports / pings. It can be use in many use examples.


## for what it's

In many projects you need to sens or send something in real world. Your project is in diginal world. But to connect numbers or states you need a bridge to fizical world. io-box have many pin's. esp32 can maka them do amazing things. But to simplify it we will say about 4 ways of using pin in esp32

- **digital inputs**
    change of state from float reading to GND or +VCC.
    Things on / off, button, swith, yes / no, true / false, connection / no connection

- **analog inputs**
    reading in voltage but also reading of potentiometer position to value in rage of 0 ... 4095
    electronic presure sensors, temperature resistors, ...

- **digital outputs**
    you will be in control if something is on of off
    if this will turning relay or light or .... It's up to project

- **analog outputs / pwm**



### software

Raports data over WiFi.
Connect to predefined in code ESSD of network with password.
Looks for mqtt server.

TODO
It use generic code to use maximum input outputs and pwm pins on device. 
Register it self with predefined name.

Over mqtt commands
- [ ] setting pin to mode
    - [ ] input digital
    - [ ] adc
    - [ ] output digital
    - [ ] pwd
- [ ] setting pin status update mode
    - [ ] input
        - [ ] on change
        - [ ] every
    - [ ] adc
        - [ ] on change
        - [ ] every
- [ ] setting pin state by mqtt command
END TODO

We can use **arduino-ide** to read / modify our code for our needs.
Install and start your **arduino-ide** with esp32 extensions


### firmware

TODO
code loading
where / what to edit
building
flashinf
testing
Node-Red flow to test your io-box

END TODO



##### code modification

We need to set up our:
- wifi ESSD name
- wifi password
- ip adress of our mqtt server, port
- `name` of device / identyficator / sender


##### flashing

Putting build code to the device. Can be done in **android-ide** by pressing `upload` button 



##### Node-Red appearance

TODO





#### legend

**GND** - ground in the terms of electric polarity

**+VCC** - positive site of electric polarity

**potentiometer** - device changing Ohms resistivity in terms of electric property by rotating shaft (rotary potentiometer) or sliding it 

**relay** - electricly ingaged and disingage switch

**pwm** - Puls With Modulation
