
import net from "net";


import blessed from 'blessed';


let getScreen = ( client )=>{
// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  input: client,
output: client,
terminal: 'xterm-256color',
fullUnicode: true
});

screen.title = 'my window title';

var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Append our box to the screen.
screen.append(box);
return screen;
};


class tPort{

    constructor(){



        const server = net.createServer((socket) => {
            console.log("TCP Server: Client connected:", socket.remoteAddress);

            
            let scr = getScreen( socket );
            scr.render();
            scr.key(['q', 'C-c'], () => {
                socket.end();
            });
            
            /*
            // Receive data from the client
            socket.on("data", (data) => {
                console.log("TCP Server: Receive from client:", data.toString());
                // send response
                scr.terminal = data;
                scr.render();
                //socket.write( Buffer.from('lo \x1b[37mclient!\x1b[0m I') );
                    //"Hello \e[37mclient!\e[0m I got your message: " + data.toString());
                // socket.end();
            });
            */
             socket.on("end", () => {c
                onsole.log("TCP Server: END");
                scr.destroy();
            });

            socket.on("close", () => {c
                onsole.log("TCP Server: Client disconnected");
                scr.destroy();
            });
        });

        server.listen(8081, "127.0.0.1", () => {
            console.log("TCP Server: Server listening on 127.0.0.1:8081");
        });




    }

}


let tp = new tPort();



export { tPort }