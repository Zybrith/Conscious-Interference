require("dotenv").config();

const tmi = require("tmi.js");
const configuration = require("./config.json");
const packageJson = require("./package.json");
const prefix = "!!";
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const fs = require("fs");
const { MONGO_CLIENT_EVENTS } = require('mongodb');
const MongoClient = require("mongodb").MongoClient;
const mongoConnect = process.env.MONGO_CONNECTION;
var shoutOutList = [];
var autoShoutoutBL = [];

// Define configuration options
const client = new tmi.Client({
  options: {
    debug: true,
    clientId: process.env.CLIENT_ID,
    joinInterval: 500,
  },
  connection: {
    reconnect: true,
    maxReconnectAttempts: Infinity,
    maxReconnectInterval: 30000,
    reconnectDecay: 1.5,
    reconnectInterval: 5000,
    secure: true,
  },
  identity: {
    username: "slugmabot",
    password: process.env.PASSWORD,
  },
  channels: configuration.operation.channels,
});
client.connect().catch(console.error);

MongoClient.connect('mongodb+srv://SlugSlugTM:<password>@twitchbot.k8ok5tr.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }).then(
  (mongoClient) => {
    console.log("Connected to MongoClient");
    // Register our event handlers (defined below)
    client.on("message", onMessageHandler);
  }
)
.catch(err=>console.log(err))

// Called every time a message comes in
function onMessageHandler(channel, tags, message, self) {
  client.on("connected", onConnectedHandler);

  /* message handler */
  let rawargs = message.trim().split(/ +/);

  let prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);
  let matchedPrefix = message.match(prefixRegex);

  // AutoShoutOut call
  AutoShoutOut(channel, tags, message, self);

  // Moderator Actions Calls
  //checkTwitchChat(channel, message, self, tags);

  if (!prefixRegex.test(message)) return;

  let args = message.slice(matchedPrefix.length).trim().split(/ +/);

  const command = args.shift().toLowerCase();

  switch (command) {
    case "so":
      //if (userstate["badges"] && "broadcaster" || "moderator" in userstate["badges"]);
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
    case "whitelist":
      WhiteListUser(target, userstate, message, self, tags, user);
      console.log(`* Executed ${message} command`);
  }
  if (self) {
    return;
  } // Ignore messages from the bot
}

// Function Called when White Listed User chats for Auto-Shoutout
function AutoShoutOut(target, userstate, msg, self, tags, user) {
  console.log(userstate);
  var uname = userstate["username"];
  var dname = userstate["display-name"];
  // If has partner badge
  if (shoutOutList.includes(uname)) return;
  if (userstate["badges"] && "partner" in userstate["badges"]) {
    shoutOutList.unshift(uname);
    client.say(target, `Hey go check out ${dname} over at twitch.tv/${uname}`);
  }
  // If in White List
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

// Raid AutoShoutOut
client.on("raided", (target, username, viewers) => {
  client.say(
    target,
    `@${username} Thank you for Raiding! Please go check them out over at twitch.tv/${username}!`
  );
});

// Function to Write to White List
/*function WhiteListUser(target, userstate, message, self, tags, user) {
  if (userstate["badges"] && "broadcaster" || "moderator" in userstate["badges"]) {
    fs.writeFile('config.json', )
  }
}*/

// Function called for Blocked Terms
function checkTwitchChat(channel, userstate, message, self, tags) {
  var uname = userstate["username"];
  var msgID = userstate["id"];
  let shouldSendMessage = false;
  shouldSendMessage = blockedWord.some((blockedWords) =>
    message.includes(blockedWords.toLowerCase())
  );
  if (shouldSendMessage) {
    // message to user
    client.say(channel, `@${uname}, Hey! Your message was deleted.`);
    // delete message
    client.deletemessage(channel, msgID);
  }
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
  console.log(args);

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
