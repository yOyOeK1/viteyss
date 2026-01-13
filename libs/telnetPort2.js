import net from 'net';
import blessed from 'blessed';

const server = net.createServer((socket) => {



socket.isTTY = true;
  socket.setRawMode = () => {};
  socket.columns = 80;
  socket.rows = 24;

// Fake setRawMode so blessed doesn't throw an error
socket.setRawMode = function(mode) {
  return this; 
};

  // 1. Create a screen instance bound to this specific socket
  const screen = blessed.screen({
   input: socket,
  output: socket,
  terminal: 'xterm-256color', // Manually force this
  //extended: true,
    smartCSR: true,
    mouse: false,     // Explicitly disable mouse to stop the characters
    warnings: false
  });

  // 2. Add UI elements to this client's screen
  const box = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: 'Welcome to the {bold}TCP Blessed Server{/bold}!',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 'blue',
      border: { fg: '#f0f0f0' }
    }
  });


  var box3 = blessed.box({
    top: '0',
    left: '0',
    width: '20%',
    height: '20%',
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
  box3.on('click', function(data) {
    box3.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
    screen.render();
    });
  
  // Append our box to the screen.
  screen.append(box3);



  // 3. Handle cleanup when the client disconnects
  socket.on('end', () => {
    screen.destroy();
  });

  // Handle errors to prevent server crashes
  socket.on('error', (err) => {
    console.error('Socket error:', err);
    screen.destroy();
  });

  // 4. Important: Render the screen for this client
  screen.render();

  // Simple key interaction
  screen.key(['q', 'C-c'], () => {
    socket.end();
  });
});

server.listen(8081, () => {
  console.log('Blessed TCP server listening on port 8081');
});