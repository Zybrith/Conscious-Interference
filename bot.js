const Twurple = require("@twurple/chat");
const Auth = require("@twurple/auth");
const PubSub = require("@twurple/pubsub");
require("dotenv").config();

const tmi = require("tmi.js");
const configuration = require("./config.json");
const packageJson = require("./package.json");
const fs = require("fs");

const prefix = "!";
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const { MONGO_CLIENT_EVENTS } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const mongoConnect = process.env.MONGO_CONNECTION;
var shoutOutList = [];
const soBadges = ["moderator", "broadcaster"];
const authProvider = new Auth.StaticAuthProvider(
  process.env.CLIENT_ID,
  process.env.PASSWORD
);

staticToken = authProvider.getAccessToken();
console.log(
  `Static token has value ${
    staticToken.accessToken
  } and scopes [${staticToken.scope?.join(", ")}]`
);

refreshToken = {
  accessToken: staticToken,
  refreshToken: process.env.REFRESH_TOKEN,
  expiresIn: 0,
  obtainmentTimestamp: 0,
};
console.log(
  `Refresh token has value ${
    refreshToken.accessToken
  } and scopes [${refreshToken.scope?.join(", ")}]`
);

console.log("Creating refresh token provider");
const refreshConfig = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.PASSWORD,
  onRefresh: async (newToken) => {
    console.log("onRefresh: ", onRefresh);
    let initialRefreshToken = refreshToken;
    refreshToken = newToken;
    console.log(
      `refreshToken updated from ${initialRefreshToken} to ${refreshToken}`
    );
  },
};
// const refreshingAuthProvider = new Auth.RefreshingAuthProvider(refreshConfig, refreshToken);
// console.log("Created refresh token provider");

// refreshingAuthProvider.refresh();

let chatClient;
let apiClient;
async function main() {
  console.log("Creating chat client");
  chatClient = new Twurple.ChatClient({
    authProvider,
    channels: configuration.operation.channels,
  });
  await chatClient.connect();
  console.log("CONNECTED");

  chatClient.onMessage((channel, user, text, userInfo) => {
    let chatter = userInfo.userInfo;
    dispMessage(chatter, text)
    onMessageHandler(channel, chatter, text, user === "slugmabot");
  });

  let pubSubClient = new PubSub.PubSubClient();
  //const userId = new Twurple.ChatUser("SlugSlugTM").userId;

  console.log("Registering PubSub listeners");
  const userId = await pubSubClient.registerUserListener(authProvider);
  console.log("userId: ", userId);
  const listener = await pubSubClient.onRedemption(userId, (message) => {
    console.log(`${message.message} just subscribed!`);
  });
  console.log(`PubSub Listener Topic: ${listener.topic} `);

  MongoClient.connect(mongoConnect, { useUnifiedTopology: true })
    .then((mongoClient) => {
      console.log("Connected to MongoClient");
      // Register our event handlers (defined below)
      chatClient.on("message", onMessageHandler);
    })
    .catch((err) => console.log(err));

  function dispMessage(chatter, text)
  {
    console.log(`${chatter.displayName} (${Array.from(chatter.badges.keys())}): %c${text}`, "color: green");
  }

  function onMessageHandler(channel, userstate, message, self) {
    // Called every time a message comes in
    //chatClient.on("connected", onConnectedHandler);

    /* message handler */
    let rawargs = message.trim().split(/ +/);

    let prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);

    // AutoShoutOut call
    AutoShoutOut(channel, userstate, message, self);

    // Special Shoutout for Mish
    //MishmxSO(channel, tags, message, self)

    // Moderator Actions Calls
    //checkTwitchChat(channel, message, self, tags);

    // Ban Zoe
    //BanZoelavernstan(channel, userstate, message, self);

    if (!prefixRegex.test(message)) return;

    let args = message.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    switch (command) {
      case "so":
        const canSO = Array.from(userstate.badges.keys()).some((badge) =>
          soBadges.includes(badge)
        );
        if (canSO) {
          chatClient.say(
            channel,
            `Check out ${rawargs[1]} over at https://twitch.tv/${rawargs[1]}`
          );
          console.log(`* Executed ${message} command`);
          chatClient.say(
            channel,
            `/announce Check out ${rawargs[1]} over at https://twitch.tv/${rawargs[1]}`
          );
        }
        break;
      //If the command is known, let's execute it
      //Hello Command
      case "hello":
        chatClient.say(channel, `@${userstate.userName}, heya!`);
        console.log(`* Executed ${message} command`);
        break;
      //Bye Command
      case "bye":
        chatClient.say(
          channel,
          `@${userstate.userName}, You're not allowed to leave!`
        );
        console.log(`* Executed ${message} command`);
        break;
      //Roll Dice Command
      case "dice":
        const num = rollDice();
        chatClient.say(channel, `You rolled a ${num}`);
        console.log(`* Executed ${message} command`);
        break;
      //support for bjurkk
      case "bjurkk":
        chatClient.say(
          channel,
          "Bjurkk deserves your support, subscribe to Youtube and Follow on twitch: https://www.youtube.com/channel/UCZR3mlfEWsBB4ZV-bZQqbtQ : https://www.twitch.tv/bjurkk"
        );
        console.log(`* Executed ${message} command`);
        break;
      //get cucked peen
      case "peen":
        chatClient.say(
          channel,
          "@SenorSpicyPeen Peter Grill has B tier plot, copium."
        );
        console.log(`* Executed ${message} command`);
        break;
      //lurk command
      case "lurk":
        chatClient.say(channel, `${userstate.userName} is now lurking`);
        console.log(`* Executed ${message} command`);
        break;
      //unlurk command
      case "lurk":
        chatClient.say(
          channel,
          `${userstate.userName} is now back from their lurk!`
        );
        console.log(`* Executed ${message} command`);
        break;
      //head pat command
      case "pats":
        chatClient.say(channel, `${userstate.userName} pats ${rawargs[1]}`);
        console.log(`* Executed ${message} command`);
        break;
      //melina command
      case "melina":
        chatClient.say(
          channel,
          "You... have inherited the Frenzied Flame. A pity. You are no longer fit. Our journey together ends here. And remember... Should you rise as the Lord of Chaos, I will kill you, as sure as night follows day. Such is my duty, for allowing you the strength of runes. Goodbye, my companion. Goodbye, Torrent..."
        );
        console.log(`* Executed ${message} command`);
        break;
      //cringe command
      case "cringe":
        chatClient.say(Channel, "Thats cringe af fr fr on god");
        console.log(`* Executed ${message} command`);
        break;
      //en command
      case "en":
        chatClient.say(
          Channel,
          "EN is loved by Slug, brought to you by SlugmaBot"
        );
        console.log(`* Executed ${message} command`);
        break;
      //kei chad command
      case "kei":
        chatClient.say(
          channel,
          "KEI CHAD KEI CHAD KEI CHAD KEI CHAD KEI CHAD KEI CHAD"
        );
        console.log(`* Executed ${message} command`);
        break;
      //Debug call command
      case "debug":
        if (
          userstate.userName == "slugslugtm" ||
          userstate.userName == "goldgoldtm" ||
          userstate.userName == "zybrith"
        ) {
          debugCommand(channel, userstate, message, false);
        } else {
          cient.say(
            channel,
            `${userstate.userName} -> You can't use this command.`
          );
        }
        break;
      case "whitelist":
        WhiteListUser(target, userstate, message, self, userstate, user);
        console.log(`* Executed ${message} command`);
    }
    if (self) {
      return;
    } // Ignore messages from the bot
  }

  // Function Called when White Listed User chats for Auto-Shoutout
  function AutoShoutOut(target, userstate, msg, self) {
    var uname = userstate.userName;
    var dname = userstate.displayName;
    var autoShoutoutBL = configuration.operation.shoutoutBL;
    // If has partner badge
    if (autoShoutoutBL.includes(uname)) return;
    if (shoutOutList.includes(uname)) return;
    if (userstate.badges.has("partner")) {
      shoutOutList.unshift(uname);
      chatClient.say(
        target,
        `Hey go check out ${dname} over at twitch.tv/${uname}`
      );
      chatClient.say(
        target,
        `/announce Hey go check out ${dname} over at twitch.tv/${uname}`
      );
    }
    // If in White List
    else
      configuration.operation.shoutout.forEach(function (rtn, indexShoutout) {
        if (rtn == uname) {
          shoutOutList.unshift(uname);
          chatClient.say(
            target,
            `Hey go check out ${dname} over at twitch.tv/${uname}`
          );
          chatClient.say(
            target,
            `/announce Hey go check out ${dname} over at twitch.tv/${uname}`
          );
        }
      });
  }

  // Raid AutoShoutOut
  chatClient.onRaid((target, username, raidInfo, msg) => {
    chatClient.say(
      target,
      `${username} Thank you for Raiding! Please go check them out over at twitch.tv/${username} !`
    );
    chatClient.say(
      target,
      `/announce ${username} Thank you for Raiding! Please go check them out over at twitch.tv/${username} !`
    );
    chatClient.say(target, `/shoutout ${username}`);
  });

  //ban Zoe
  function BanZoelavernstan(target, userstate, msg, self, tags, user) {
    var uname = userstate["username"];
    if (uname == "zoelavernestan")
      chatClient.say(target, `/timeout zoelavernestan 69`);
  }

  // Function called when the "dice" command is issued
  function rollDice() {
    const sides = 20;
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
        chatClient.say(
          target,
          `${uname} -> You need to use a valid sub-command!`
        );
        break;
      case "emote-set":
        chatClient.say(
          target,
          `I have the following Emote sets unlocked: ${sets}`
        );
        break;
      case "joined-channels":
        chatClient.say(
          target,
          `I am currently lurking in ${
            chatClient.getChannels().length
          } channels`
        );
        break;
      case "ping":
        chatClient.ping();
        responseChannel = target;
        break;
      case "sudo":
        message = args.join(" ");
        chatClient.say(target, `${message}`);
        break;
      case "action":
        message = args.join(" ");
        chatClient.action(target, `${message}`);
        break;
      case "kill":
        let user = args[0];
        chatClient.say(target, `${uname} killed ${user}. LUL`);
        break;
      case "host":
      case "h":
        if (args[0] == "-f") {
          chatClient.host("slugmabot", target);
          chatClient.host(opts.identity.username, target);
          chatClient.say(target, `Now dual hosting ${target}`);
        } else {
          chatClient.host(opts.identity.username, target);
          chatClient.say(target, `Now hosting ${target}`);
        }
        break;
      case "reboot":
      case "restart":
        chatClient.say(target, "Rebooting system. Please wait...");
        chatClient.disconnect();
        process.exit(0);
        break;
      case "join":
        let channelJoin = args[0];
        chatClient
          .join(channelJoin)
          .then((data) => {
            chatClient.say(target, `Joined channel ${data}`);
          })
          .catch((err) => {
            chatClient.say(target, `Error while joining channel: ${err}`);
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
          chatClient.say(
            target,
            `${uname} -> An error occurred while running the Eval command. Check console for details.`
          );
        }
        break;
      case "crash":
        chatClient.disconnect();
        process.exit(0);
        break;
    }
  }
}

main();
// Define configuration options
/*const client = new tmi.Client({
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
client.connect().catch(console.error);*/

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
