var votesAccept = 0;
var votesDenied = 0;
var voters = new Set(); 


function setupChatVoting() {
    console.log("Voting system initialized...");
    const client = new tmi.Client({
        options: { debug: true },
        channels: ['psp1g']
    });

    client.connect().catch(console.error);

    client.on('message', (channel, tags, message, self) => {
        if (self) return;

        const username = tags.username;

        // Check if the user has already voted
        if (voters.has(username)) {
            console.log(`${username} has already voted.`);
            return;
        }

        // Process the vote
        if (message === 'DENIED') {
            votesDenied++;
            voters.add(username);
        } else if (message === 'APPROVED') {
            votesAccept++;
            voters.add(username);
        }
        updateVotingBar();

        // Debug logs
        console.log(tags['username']);
        console.log(`Votes: DENIED=${votesDenied} | APPROVED=${votesAccept}`);
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