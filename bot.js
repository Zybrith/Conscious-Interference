const tmi = require('tmi.js');
const client = new tmi.Client({
  // Log bot actions On/Off
	options: { debug: true},
  // Login information for Bot
	identity: {
		username: 'robo_goldgold',
		password: '1gnc9qjsalw2hj2cuu2v7cwn9i1v23'
	},
	channels: [ 'GoldGoldTM' ]
  
});
console.log(client.getUsername());
  console.log(client.readyState());
// Message Variable
client.on('message', onMessageHandler);
client.connect().catch(console.error);

function onMessageHandler(channel, tags, message, self) {
// Connected Variable
client.on('connected', onConnectedHandler);
	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
    console.log(`* Executed ${message} command`);
	}

  // Dab Test
  if (message.toLowerCase() === '!dab') {
    client.say(channel, `Kinda cringe... dont you think?`);
    console.log(`* Executed ${message} command`);
  
  }
  // No Identifier test
  else if (message.toLowerCase() === 'cringe') {
    client.say(channel, `Ya that's quite cringe ngl...`);
    console.log(`* Executed ${message} command`);
  
  }

  // If the command is known, let's execute it
  else if (message.toLowerCase() === '!dice') {
    const num = rollDice();
    client.say(channel, `You rolled a ${num} @${tags.username}`);
    console.log(`* Executed ${message} command`);
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
};