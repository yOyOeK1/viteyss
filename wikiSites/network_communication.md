# network and communication

There is no restrictions how you will arrange communication in your setup.

If you run your instance of **yss** or **nod-red** on the phone there is close to zero of input / output ports on the device. So communication can be done by:

- phone wifi to esp32.

- phone bluetooth to esp32

From esp32 it can be a executable box device with connected component to it. Ra porting readings on pings, changing state of output pins on upcoming messages.

From esp32 it can be connected to canBus / uard / spi / i2c / bluetooth / wifi / ...

In many of examples in this wiki there will be assumption that it's a stand alone box. 
