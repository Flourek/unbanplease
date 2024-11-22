var votesAccept = 0;
var votesDenied = 0;
var newBans = 0;
var voters = new Map(); // Change to Map to store username and their votes

function setupChatVoting() {
    console.log("Voting system initialized...");
    const client = new tmi.Client({
        options: { debug: false },
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
    

    client.on('message', (channel, tags, message, self) => {
        if (self) return;

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
