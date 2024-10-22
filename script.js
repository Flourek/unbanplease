// Function to dynamically load jQuery
function loadjQuery(callback) {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';  // URL of jQuery CDN
    script.type = 'text/javascript';
    script.onload = callback;  // When jQuery is loaded, execute the callback

    document.head.appendChild(script);  // Append script to head
}



// Usage: Load jQuery and then run your code
loadjQuery(function() {
    // Now jQuery is loaded and you can use it here
    $(document).ready(function() {
        console.log("jQuery has been loaded and is ready to use.");
        
        // Inject external HTML into #content div
        const newDiv = $('<div></div>').text('This is a dynamically created div!');
        newDiv.load('content.html');
        $('body').append(newDiv);
        

        // Inject external CSS by appending it to the head of the document
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'style.css'
        }).appendTo('head');
            
       
    });
});


