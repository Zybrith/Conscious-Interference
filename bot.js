const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: 'robo_goldgold',
    password: 'cyg73wnc4c34rfbwl1z3f5ncp6ti4h'
  },
  channels: [
    'GoldGoldTM', 'ZumZumTM', 'SlugSlugTM'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // Dab Test
  if (commandName === '!dab') {
    client.say(target, `Kinda cringe... dont you think?`);
    console.log(`* Executed ${commandName} command`);
  
  }
  // No Identifier test
  if (commandName === 'cringe') {
    client.say(target, `Ya that's quite cringe ngl...`);
    console.log(`* Executed ${commandName} command`);
  
  }

  // If the command is known, let's execute it
  else if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } 
  
  // If no command's triggered, send console message
  else {
    console.log(`* Unknown command ${commandName}`);
  }

}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 100;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}