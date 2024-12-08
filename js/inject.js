var uri = new URL('https://flourek.github.io/unbanplease/');

function loadScripts(urls, callback) {
    let index = 0;

    function loadNextScript() {
        if (index < urls.length) {
            const script = document.createElement('script');
            script.src = urls[index];
            script.type = 'text/javascript';
            script.onload = () => {
                console.log(`Loaded: ${urls[index]}`);
                index++;
                loadNextScript(); // Load the next script
            };
            script.onerror = () => {
                console.error(`Failed to load: ${urls[index]}`);
            };
            document.head.appendChild(script);
        } else if (typeof callback === 'function') {
            callback(); // Execute the callback when all scripts are loaded
        }
    }

    loadNextScript();
}

// Example usage
loadScripts([
    "https://code.jquery.com/jquery-3.7.1.js", 
    "https://code.jquery.com/ui/1.14.0/jquery-ui.js",
    "https://flourek.github.io/unbanplease/js/Twitch/tmi.min.js",
    "https://flourek.github.io/unbanplease/js/Twitch/DeviceCodeFlow.js",
    "https://flourek.github.io/unbanplease/js/Twitch/emotes.js"
], () => {
    startObserving();
    console.log("All scripts loaded successfully!");
});


// Function waiting for twitch to load everything
function startObserving() {
    const targetNode = document.getElementById('root');
    
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        for (let mutation of mutationsList) {
            // Check if the data-a-page-events-submitted attribute is added

            if (mutation.type === 'attributes' && mutation.attributeName === 'data-a-page-events-submitted') {
                if ( $('#unban-request-details') ){
                    onPageLoaded();
                    observer.disconnect(); // Stop observing once the attribute is detected
                    break;                  // Exit loop after executing your code
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}


// actually inject the custom html and js after everything else has finished loading
function onPageLoaded() {

    $.get(uri + 'html/head.html', function(data) {
        const modifiedContent = data.replace(/URL/g, uri);
        
        // Inject modified content directly into the head
        $('head').append(modifiedContent);
    });


    const body = $('<div id="sus"></div>').text('This is a dynamically created div!');
    
    body.load(uri + 'html/content.html', function(data) {
        // Replace __URL__ in the loaded content with the actual URL
        const modifiedContent = data.replace(/URL/g, uri);
        
        // Set the modified content to the new div
        body.html(modifiedContent);
    });
    
    $('#root').append(body);

}