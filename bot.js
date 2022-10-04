const tmi = require("tmi.js");
// const configuration = require("./config.json");
// const packageJson = require("./package.json");
const prefix = "!!";
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var shoutOutList = [];


// Define configuration options
const client = new tmi.Client({
  options: { debug: true, joinInterval: 500 },
  identity: {
    username: "slugmabot",
    password: "874fdrkjja9owgf3nxsp6mlrt9v24e",
  },
  channels: [
    "slugmabot",
    "slugslugtm",
    "dh_x12",
    "jirotheoni",
    "goldgoldtm",
    "zumzumtm",
  ],
});
client.connect().catch(console.error);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);

// Called every time a message comes in
function onMessageHandler(channel, tags, message, self) {
  client.on("connected", onConnectedHandler);

  /* message handler */
  let rawargs = message.trim().split(/ +/);

  let prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);
  let matchedPrefix = message.match(prefixRegex);

  //AutoShoutOut call
  AutoShoutOut(channel, tags, message, self);

  if (!prefixRegex.test(message)) return;

  let args = message.slice(matchedPrefix.length).trim().split(/ +/);

  const command = args.shift().toLowerCase();

  switch (command) {
    case "so":
      client.say(
        channel,
        `Check out ${rawargs[1]} over at https://twitch.tv/${rawargs[1]}`
      );
      console.log(`* Executed ${message} command`);
      break;
    case "aso":
      client.say(
        channel,
        `/announce Check out ${rawargs[1]} over at https://twitch.tv/${rawargs[1]}`
      );
      console.log(`* Executed ${message} command`);
      break;
    //If the command is known, let's execute it
    //Hello Command
    case "hello":
      client.say(channel, `@${tags.username}, heya!`);
      console.log(`* Executed ${message} command`);
      break;
    //Bye Command
    case "bye":
      client.say(channel, `@${tags.username}, You're not allowed to leave!`);
      console.log(`* Executed ${message} command`);
      break;
    //Roll Dice Command
    case "dice":
      const num = rollDice();
      client.say(channel, `You rolled a ${num}`);
      console.log(`* Executed ${message} command`);
      break;
    //support for bjurkk
    case "bjurkk":
      client.say(
        channel,
        "Bjurkk deserves your support, subscribe to Youtube and Follow on twitch: https://www.youtube.com/channel/UCZR3mlfEWsBB4ZV-bZQqbtQ : https://www.twitch.tv/bjurkk"
      );
      console.log(`* Executed ${message} command`);
      break;
    //get cucked peen
    case "peen":
      client.say(
        channel,
        "@SenorSpicyPeen Peter Grill has B tier plot, copium."
      );
      console.log(`* Executed ${message} command`);
      break;
    //lurk command
    case "lurk":
      client.say(channel, `${tags.username} is lurking and will return soon`);
      console.log(`* Executed ${message} command`);
      break;
    //head pat command
    case "pats":
      client.say(channel, `${tags.username} pats ${rawargs[1]}`);
      console.log(`* Executed ${message} command`);
      break;
    //melina command
    case "melina":
      client.say(
        channel,
        "You... have inherited the Frenzied Flame. A pity. You are no longer fit. Our journey together ends here. And remember... Should you rise as the Lord of Chaos, I will kill you, as sure as night follows day. Such is my duty, for allowing you the strength of runes. Goodbye, my companion. Goodbye, Torrent..."
      );
      console.log(`* Executed ${message} command`);
      break;
    //cringe command
    case "cringe":
      client.say(Channel, "Thats cringe af fr fr on god");
      console.log(`* Executed ${message} command`);
      break;
    //en command
    case "en":
      client.say(Channel, "EN is loved by Slug, brought to you by SlugmaBot");
      console.log(`* Executed ${message} command`);
      break;
    //kei chad command
    case "kei":
      client.say(
        channel,
        "KEI CHAD KEI CHAD KEI CHAD KEI CHAD KEI CHAD KEI CHAD"
      );
      console.log(`* Executed ${message} command`);
      break;
    //Debug call command
    case "debug":
      if (
        tags.username == "slugslugtm" ||
        tags.username == "goldgoldtm" ||
        tags.username == "zybrith"
      ) {
        debugCommand(channel, tags, message, false);
      } else {
        cient.say(channel, `${tags.username} -> You can't use this command.`);
      }
      break;
  }
  if (self) {
    return;
  } // Ignore messages from the bot
}

// Function Called when White Listed User chats for Auto-Shoutout
function AutoShoutOut(target, userstate, msg, self, tags, user) {
  var uname = userstate["username"];
  var dname = userstate["display-name"];
  if (shoutOutList.includes(uname)) return;
  configuration.operation.shoutout.forEach(function (rtn, indexShoutout) {
    if (rtn == uname) {
      shoutOutList.unshift(uname);
      client.say(
        target,
        `Hey go check out ${dname} over at twitch.tv/${uname}`
      );
    }
  });
}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

//Function Debugging
function debugCommand(target, userstate, msg, self, tags, user) {
  let prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);
  let matchedPrefix = msg.match(prefixRegex);
  let args = msg.slice(matchedPrefix.length).trim().split(/ +/);
  let subCommand = args[1];

  var badges = JSON.stringify(userstate["badges"]);
  var uname = userstate["username"];
  let message = args.splice(0, 2);
  let chnl = args[0];

  switch (subCommand) {
    default:
      client.say(target, `${uname} -> You need to use a valid sub-command!`);
      break;
    case "emote-set":
      client.say(target, `I have the following Emote sets unlocked: ${sets}`);
      break;
    case "joined-channels":
      client.say(
        target,
        `I am currently lurking in ${client.getChannels().length} channels`
      );
      break;
    case "ping":
      client.ping();
      responseChannel = target;
      break;
    case "sudo":
      message = args.join(" ");
      client.say(target, `${message}`);
      break;
    case "action":
      message = args.join(" ");
      client.action(target, `${message}`);
      break;
    case "kill":
      let user = args[0];
      client.say(target, `${uname} killed ${user}. LUL`);
      break;
    case "host":
    case "h":
      if (args[0] == "-f") {
        client.host("slugmabot", target);
        client.host(opts.identity.username, target);
        client.say(target, `Now dual hosting ${target}`);
      } else {
        client.host(opts.identity.username, target);
        client.say(target, `Now hosting ${target}`);
      }
      break;
    case "reboot":
    case "restart":
      client.say(target, "Rebooting system. Please wait...");
      client.disconnect();
      process.exit(0);
      break;
    case "join":
      let channelJoin = args[0];
      client
        .join(channelJoin)
        .then((data) => {
          client.say(target, `Joined channel ${data}`);
        })
        .catch((err) => {
          client.say(target, `Error while joining channel: ${err}`);
          console.warn(`Error while joining channel. ${err}`);
        });
      break;
    case "eval":
    case "evaluate":
      message = args.join(" ");
      try {
        eval(`${message}`);
      } catch (err) {
        console.warn(`Error while Evaluating command. ${err}`);
        client.say(
          target,
          `${uname} -> An error occurred while running the Eval command. Check console for details.`
        );
      }
      break;
    case "crash":
      client.disconnect();
      process.exit(0);
      break;
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

//Original code from GitHub below I think it's outdated

// const tmi = require('tmi.js');
// const client = new tmi.Client({
//   // Log bot actions On/Off
// 	options: { debug: true},
//   // Login information for Bot
// 	identity: {
// 		username: 'robo_goldgold',
// 		password: '1gnc9qjsalw2hj2cuu2v7cwn9i1v23'
// 	},
// 	channels: [ 'GoldGoldTM' ]

// });
// console.log(client.getUsername());
//   console.log(client.readyState());
// // Message Variable
// client.on('message', onMessageHandler);
// client.connect().catch(console.error);

// function onMessageHandler(channel, tags, message, self) {
// // Connected Variable
// client.on('connected', onConnectedHandler);
// 	if(self) return;
// 	if(message.toLowerCase() === '!hello') {
// 		client.say(channel, `@${tags.username}, heya!`);
//     console.log(`* Executed ${message} command`);
// 	}

//   // Dab Test
//   if (message.toLowerCase() === '!dab') {
//     client.say(channel, `Kinda cringe... dont you think?`);
//     console.log(`* Executed ${message} command`);

//   }
//   // No Identifier test
//   else if (message.toLowerCase() === 'cringe') {
//     client.say(channel, `Ya that's quite cringe ngl...`);
//     console.log(`* Executed ${message} command`);

//   }

//   // If the command is known, let's execute it
//   else if (message.toLowerCase() === '!dice') {
//     const num = rollDice();
//     client.say(channel, `You rolled a ${num} @${tags.username}`);
//     console.log(`* Executed ${message} command`);
//   }

// // Function called when the "dice" command is issued
// function rollDice () {
//   const sides = 100;
//   return Math.floor(Math.random() * sides) + 1;
// }

// // Called every time the bot connects to Twitch chat
// function onConnectedHandler (addr, port) {
//   console.log(`* Connected to ${addr}:${port}`);
// }
// };
