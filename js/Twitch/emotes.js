

const config = {
    channel: getChannelName(),
    emotes: [],
  };


const getEmotes = async () => {
    // const proxy = "https://tpbcors.herokuapp.com/";
    const proxy = "https://api.roaringiron.com/proxy/";
    console.log(config);
  
    if (!config.channel)
      return $("#errors").html(
        `Invalid channel. Please enter a channel name in the URL. Example: https://api.roaringiron.com/emoteoverlay?channel=forsen`
      );
  
    const twitchId = (
      await (
        await fetch(
          proxy + "https://api.ivr.fi/v2/twitch/user?login=" + config.channel,
          {
            headers: { "User-Agent": "api.roaringiron.com/emoteoverlay" },
          }
        )
      ).json()
    )?.[0].id;
  
    await (
      await fetch(
        proxy + "https://api.frankerfacez.com/v1/room/" + config.channel
      )
    )
      .json()
      .then((data) => {
        const emoteNames = Object.keys(data.sets);
        for (let i = 0; i < emoteNames.length; i++) {
          for (let j = 0; j < data.sets[emoteNames[i]].emoticons.length; j++) {
            const emote = data.sets[emoteNames[i]].emoticons[j];
            config.emotes.push({
              name: emote.name,
              url:
                "https://" +
                (emote.urls["2"] || emote.urls["1"]).split("//").pop(),
            });
          }
        }
      })
      .catch(console.error);
  
    await (
      await fetch(proxy + "https://api.frankerfacez.com/v1/set/global")
    )
      .json()
      .then((data) => {
        const emoteNames = Object.keys(data.sets);
        for (let i = 0; i < emoteNames.length; i++) {
          for (let j = 0; j < data.sets[emoteNames[i]].emoticons.length; j++) {
            const emote = data.sets[emoteNames[i]].emoticons[j];
            config.emotes.push({
              name: emote.name,
              url:
                "https://" +
                (emote.urls["2"] || emote.urls["1"]).split("//").pop(),
            });
          }
        }
      })
      .catch(console.error);
  
    await (
      await fetch(
        proxy + "https://api.betterttv.net/3/cached/users/twitch/" + twitchId
      )
    )
      .json()
      .then((data) => {
        for (let i = 0; i < data.channelEmotes.length; i++) {
          config.emotes.push({
            name: data.channelEmotes[i].code,
            url: `https://cdn.betterttv.net/emote/${data.channelEmotes[i].id}/2x`,
          });
        }
        for (let i = 0; i < data.sharedEmotes.length; i++) {
          config.emotes.push({
            name: data.sharedEmotes[i].code,
            url: `https://cdn.betterttv.net/emote/${data.sharedEmotes[i].id}/2x`,
          });
        }
      })
      .catch(console.error);
  
    await (
      await fetch(proxy + "https://api.betterttv.net/3/cached/emotes/global")
    )
      .json()
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          config.emotes.push({
            name: data[i].code,
            url: `https://cdn.betterttv.net/emote/${data[i].id}/2x`,
          });
        }
      })
      .catch(console.error);
  
    await (
      await fetch(proxy + "https://7tv.io/v3/emote-sets/global")
    )
      .json()
      .then((data) => {
        for (let i = 0; i < data.emotes.length; i++) {
          config.emotes.push({
            name: data.emotes[i].name,
            url: `https://cdn.7tv.app/emote/${data.emotes[i].id}/2x.webp`,
          });
        }
      })
      .catch(console.error);
  
    await (
      await fetch(proxy + "https://7tv.io/v3/users/twitch/" + twitchId)
    )
      .json()
      .then((data) => {
        const emoteSet = data["emote_set"];
        if (emoteSet === null) return;
        const emotes = emoteSet["emotes"];
        for (let i = 0; i < emotes.length; i++) {
          config.emotes.push({
            name: emotes[i].name,
            url:
              "https:" +
              emotes[i].data.host.url +
              "/" +
              emotes[i].data.host.files[2].name,
          });
        }
      })
      .catch(console.error);
  
    const successMessage = `Successfully loaded ${config.emotes.length} emotes for channel ${config.channel}`;
  
    $("#errors").html(successMessage).delay(2000).fadeOut(300);
    console.log(successMessage, config.emotes);

    
    const message = "faefe whatever gachiGASM PogChamp and more gachiGASM stuff";
    const result = replaceEmotes(message);
    console.log(result);

  };

getEmotes();


function replaceEmotes(message) {
    // Iterate over each emote in the array
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Iterate over each emote in the array
    config.emotes.forEach(emote => {
        // Escape the emote name for safe regex usage
        const emoteName = escapeRegex(emote.name);
        // Create a regex to find the emote name in the message
        const emoteRegex = new RegExp(`\\b${emoteName}\\b`, 'g');
        // Replace the emote name with an <img> tag
        message = message.replace(emoteRegex, `<img class="emote" src="${emote.url}">`);
    });

    return message;
}


