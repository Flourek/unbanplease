var uri = new URL('http://127.0.0.1:5500/');

// Inject jQuery
function loadjQuery(callback) {
    var script = document.createElement('script');
    script.src = "https://code.jquery.com/jquery-3.7.1.js";  // URL of jQuery CDN
    script.type = 'text/javascript';
    //  When jQuery is loaded, execute the callback
     
     var scripte = document.createElement('script');
     scripte.src = "https://code.jquery.com/ui/1.14.0/jquery-ui.js";  // URL of jQuery CDN
     scripte.type = 'text/javascript';
     
     document.head.appendChild(script);  // Append script to head
     document.head.appendChild(scripte); 
     scripte.onload = callback; 
}

// Entry point
loadjQuery(function() {
    $(document).ready(function() {

        startObserving();
        console.log("jQuery has been loaded and is ready to use.");
  
    });
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
    
    $('body').append(body);

}