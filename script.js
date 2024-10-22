$(document).ready(function() {
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
