var votesAccept = 0;
var votesDenied = 0;
var newBans = 0;
var voters = new Map(); // Change to Map to store username and their votes

var chatters = new Set();


function setupChatVoting() {
    console.log("Voting system initialized...");
    const client = new tmi.Client({
        options: { debug: true },
        connection: { reconnect: true},
        channels: [getChannelName()]
    });

    client.connect().catch(console.error);

    client.on('ban', (channel, tags, message, self) => {
        newBans++;
        updateCounter();
    });

    client.on("subscription",  () => giveMoney());
    client.on("resub",         () => giveMoney());
    client.on("cheer",         () => giveMoney());
    client.on("submysterygift",() => giveMoney());
    client.on("subgift",       () => giveMoney());

    client.on('message', async (channel, tags, message, self) => {
        chatters.add(tags['user-id']);

        if(self || !message.startsWith('-')) return;
        if (tags.username.toLowerCase() == 'nightbot') return;
        if( !(tags.mod || tags.username == getChannelName())) return;
        
        console.log(tags);

        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();
    
        if(command === 'bribe') {
            count = args[0];
            if (!args[0]) count = 1;
            let index = 0; // Start iteration count
            const interval = setInterval(() => {
                giveMoney();
                index++;

                if (index >= count) {
                    clearInterval(interval); // Stop once we've done the desired count
                }
            }, 300); // 500ms between each call
        }

        if(command === 'alert') {
            citation(`${tags['display-name']}: ${args.join(' ')}`);
        }
        
        if(command === 'ending') {
           ending();
        }
    });
  

    client.on('message', (channel, tags, message, self) => {
        if (self) return;
        if (tags.username.toLowerCase() == 'nightbot') return;

        const username = tags.username;
        let currentVote = voters.get(username);


        // Process the vote based on the message
        if (message.includes('DENIED')) {
            if (currentVote === 'DENIED') {
                console.log(`${username} already voted DENIED.`);
                return; // Same vote, no changes needed
            }

            if (currentVote === 'APPROVED') {
                votesAccept--; // Revoke previous APPROVED vote
                console.log(`${username} changed vote from APPROVED to DENIED.`);
            }

            votesDenied++; // Increment DENIED count
            voters.set(username, 'DENIED'); // Update their vote
        } else if (message.includes('APPROVED')) {
            if (currentVote === 'APPROVED') {
                console.log(`${username} already voted APPROVED.`);
                return; 
            }

            if (currentVote === 'DENIED') {
                votesDenied--; 
                console.log(`${username} changed vote from DENIED to APPROVED.`);
            }

            votesAccept++; 
            voters.set(username, 'APPROVED');
        }

        updateVotingBar();

    });
}

// Function to reset the voting system
function resetVotes() {
    votesAccept = 0;
    votesDenied = 0;
    voters.clear(); // Clear the set of voters
    console.log("Votes and voters have been reset.");
    updateVotingBar();
}


function getRandomChatter() {
    const arrayFromSet = Array.from(chatters);

    // Get a random element
    const randomElement = arrayFromSet[Math.floor(Math.random() * arrayFromSet.length)];

    return randomElement
}

function updateVotingBar() {
    const totalVotes = votesAccept + votesDenied;

    $('#voteAccepted').html(votesAccept);
    $('#voteDenied').html(votesDenied);

    if (totalVotes === 0) {
        // Reset bar if no votes
        $('#voteBarAccepted').css('width', '0%');
        $('#voteBarDenied').css('width', '0%');
        return;
    }

    const approvedPercentage = (votesAccept / totalVotes) * 50;
    const deniedPercentage = (votesDenied / totalVotes) * 50;

    // Update the widths of the bars
    $('#voteBarAccepted').css('width', `${approvedPercentage}%`);
    $('#voteBarDenied').css('width', `${deniedPercentage}%`);
}

function getChannelName() {
    const url = window.location.href; // Get the current URL
    const match = url.match(/twitch\.tv\/popout\/moderator\/([^/]+)/);
    return match ? match[1] : null; // Return the channel name or null if not found
}
