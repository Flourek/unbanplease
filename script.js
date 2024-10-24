
var uri = new URL('https://wierzba.wzks.uj.edu.pl/~21_bacza/unbanplease/');
var traveller_index = -1;

// Function to dynamically load jQuery
function loadjQuery(callback) {
    var script = document.createElement('script');
    script.src = "https://code.jquery.com/jquery-3.7.1.js";  // URL of jQuery CDN
    script.type = 'text/javascript';
     // When jQuery is loaded, execute the callback

     
    //  var scripte = document.createElement('script');
    //  scripte.src = "https://code.jquery.com/ui/1.14.0/jquery-ui.js";  // URL of jQuery CDN
    //  scripte.type = 'text/javascript';
     
    script.onload = callback; 
    document.head.appendChild(script);  // Append script to head
    // document.head.appendChild(scripte); 
    
}


// Function to execute when the page is fully loaded
function onPageLoaded() {
    console.log("Page loading completed. Executing your code...");

    const apngImage = document.getElementById("accept_walk");



}

// Function to start observing the DOM for changes
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
                    break; // Exit loop after executing your code
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

// Start observing immediately
startObserving();



function sound(filename, delay=0, loop=false){
    
    var audio = new Audio(uri + 'res/snd/' + filename);
    audio.loop = loop;

    setTimeout(function(){ 
        audio.play();
    }, delay);
    
}

function pressModComment () {
    const buttonsArray = $('.unban-requests-list-item').find('button').toArray();

    // Log the array of button elements
    console.log(buttonsArray);

}

function stampsToggle () {
    $('#stamps').toggleClass('stamp-hide');
    sound('stampbar-open.wav')

}

function accept () {
    const imgElement = $('<img />', {
        src: uri + 'res/img/InkApproved.png', // Image URL
        class: 'stampInk'
    });

    leave('right');

    sound('stamp-down.wav')
    sound('stamp-up.wav', 300)

    // Append the image element to the #imageContainer
    $('.unban-requester-message h6').append(imgElement);
}

function deny () {
    const imgElement = $('<img />', {
        src: uri + 'res/img/InkDenied.png', // Image URL
        class: 'stampInk'
    });

    leave('left');

    sound('stamp-down.wav')
    sound('stamp-up.wav', 300)

    // Append the image element to the #imageContainer
    $('.unban-requester-message h6').append(imgElement);
}



function next (){
    traveller_index += 1;
    
    sound('speech-announce.wav')

    
    sound('printer-line.wav', 200)
    const buttonsArray = $('.unban-requests-list-item').find('button').toArray();
    


    if (buttonsArray.length > traveller_index){
        const button = $(buttonsArray[traveller_index]);

        // Find the image source inside the .tw-image-avatar class within the button
        const avatarSrc = button.find('.tw-image-avatar').attr('src');
        if (avatarSrc) {
            $('#personAvatar').attr('src', avatarSrc); 
        }

        walk_in();
        const randomSaturation = Math.max(0.1, Math.min(0.9, (Math.random() * 0.9 + 0.1).toFixed(2))); // Clamp between 0.1 and 0.8
        const randomHue = Math.floor(Math.random() * 360); // 0 to 360
        $('#personBody').css('filter', `saturate(${randomSaturation}) hue-rotate(${randomHue}deg)`);

        button.click();
        
    }else{
        traveller_index = buttonsArray.length - 1;
    }

    console.log(traveller_index);

}

function personSetFace(){
    const avatarSrc = $('.unban-request-details .tw-image-avatar img').attr('src');
    
    // Check if the source was found and copy it to the target image
    if (avatarSrc) {

    }
}



function walk_in (){
    const walke = $('<img>', {
        class: 'walk_in',
        src: uri + 'res/img/walk_in.png?' + new Date().getTime()
    }).appendTo('#sus');
    
 
    $('#person').removeClass( "personStationary" );
    $('#person').addClass( "personMoveIn" ).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
        $('#person').addClass( "personStationary" );
        $('#person').removeClass( "personMoveIn" );
    });

    setTimeout(function() {
        walke.remove(); // Completely remove the image element
    }, 2500);
}

function leave(dir='left'){
    $('#person').removeClass( "personStationary" );

    if(dir==='left') {
        $('#person').addClass( "personLeaveLeft" ).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
            $('#person').removeClass( "personLeaveLeft" );
        });

        var buh;
        setTimeout(function() {
            buh = $('<img>', {
                class: 'deny_walk',
                src: uri + 'res/img/deny_walk.png?' + new Date().getTime()
            }).appendTo('#sus');
        }, 1000);
        
        // Set a timeout to remove the image after 30 seconds (30,000 milliseconds)
        setTimeout(function() {
            buh.remove(); // Completely remove the image element
        }, 4500);


    }else if (dir==='right'){
        $('#person').addClass( "personLeaveRight" ).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
            $('#person').removeClass( "personLeaveRight" );
        });

        const buh = $('<img>', {
            class: 'accept_walk',
            src: uri + 'res/img/accept_walk.png?' + new Date().getTime()
        }).appendTo('#sus');
        
        // Set a timeout to remove the image after 30 seconds (30,000 milliseconds)
        setTimeout(function() {
            buh.remove(); // Completely remove the image element
        }, 30000);
    }
}




function start() {
    $('.black-screen').addClass("black-screen-hide");
    sound('booth-intro.wav')
    sound('booth-ambient.wav', 0, true)
}




$('#buh').click(function() {
    const buttonsArray = $('.unban-requests-list-item').find('button').toArray();

    // Log the array of button elements
    console.log(buttonsArray);
    
    // You can also perform other actions here, like loading content or changing styles
    // Example: $('#output').css('color', 'red');
});



// Usage: Load jQuery and then run your code
loadjQuery(function() {
    // Now jQuery is loaded and you can use it here
    $(document).ready(function() {
        console.log("jQuery has been loaded and is ready to use.");
        
        // Inject external HTML into #content div
        const newDiv = $('<div id="sus"></div>').text('This is a dynamically created div!');
        
        // Inject external CSS by appending it to the head of the document
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: uri + 'style.css'
        }).appendTo('head');
      
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'https://code.jquery.com/ui/1.14.0/themes/base/jquery-ui.css'
        }).appendTo('head');
        


        newDiv.load(uri + 'content.html', function(data) {
            // Replace __URL__ in the loaded content with the actual URL
            const modifiedContent = data.replace(/URL/g, uri);
            
            // Set the modified content to the new div
            newDiv.html(modifiedContent);
        });

        $('body').append(newDiv);
        




    });
});


