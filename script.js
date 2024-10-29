
var uri = new URL('https://wierzba.wzks.uj.edu.pl/~21_bacza/unbanplease/');

var traveller_index = -1;
var occupied = false;
var scale = 1; // Default scale
var paperZIndex = 5;

var streamerMode = false;
var originalAvatarSrc;

const UnbanDenyButton = '.cmxSxj';
const ResolutionDiv = '.kndAiU';
const ResolutionTextArea = '.gzFSTs textarea';
const DragablePapers = '#visa, #unban-request-details, #appeal'
const AppealMessage = '.unban-requester-message'

const PaperBorderRight = 1776;
const PaperBorderTop = 400;
const PaperBorderLeft = 110;
const PaperBorderBottom = 980;

let music = new Audio(uri + 'res/snd/Theme.wav');
music.loop = true; // Set looping
music.play(); 


// Function to dynamically load jQuery
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

function getScaleFactor() {
    const transform = $('body').css('transform');
    if (transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        scale = parseFloat(values[0]); // Extract the scale value
    }
}

function choose(array){
    return array[Math.floor(Math.random() * array.length)];
}

function fadeOutAudio(audio, duration) {
    let fadeOutInterval = 50; // Milliseconds for each step
    let steps = duration / fadeOutInterval; // Total steps for the fade out
    let volumeStep = audio.volume / steps; // Amount to decrease volume in each step

    let fadeOutTimer = setInterval(() => {
        if (audio.volume > volumeStep) {
            audio.volume -= volumeStep; // Decrease volume
        } else {
            audio.volume = 0; // Set to 0 to avoid going negative
            clearInterval(fadeOutTimer); // Stop when volume reaches 0
            audio.pause(); // Pause the audio
            audio.currentTime = 0; // Reset to start
        }
    }, fadeOutInterval);
    
    setTimeout(function(){ 
        audio.pause();
    }, duration + 30);


}

var isDragging = false;

// Function to execute when the page is fully loaded
function onPageLoaded() {
    console.log("Page loading completed. Executing your code...");


    $('#accept').mousedown(function() {
        pressStamp($(this), true);
    });

    $('#deny').mousedown(function() {
        pressStamp($(this), false);
    });
    
    
    $('.stampButton').mouseup(function() {
        unpressStamp($(this));
    });
    


    var keysdown = {};
    
    var isDragging = false;
    var draggable;
    var offsetX, offsetY; // Variables to store the offset

    // keydown handler
    $(document).keydown(function(e){

        // Prevent typing in text area when using binds
        if (e.keyCode === 9 || isDragging) {
            e.preventDefault(); 
        }

            // Do our thing
        if (e.keyCode === 9) {
            stampsToggle();
        }
        
        // prevent stamping if typing in appeal response
        if ($('textarea').is(':focus') && !isDragging){
            sound(choose(["text-reveal0.wav", "text-reveal1.wav", "text-reveal2.wav", "text-reveal3.wav"]));
            return;
        } 

        // Do we already know it's down?
        if (keysdown[e.keyCode]) {
            // Ignore it
            return;
        }

        // Remember it's down
        keysdown[e.keyCode] = true;

        
        if (e.keyCode === 32) {
            e.preventDefault(); // Prevents the default space scroll behavior
            streamerMode = !streamerMode;
            setAvatars();
        }
        if (e.key == 's') {
            next();
        }
        if (e.key == 'a') {
            pressStamp($('#deny'), false);
        }
        if (e.key == 'd') {
            pressStamp($('#accept'), true);
        }

    });

    // keyup handler
    $(document).keyup(function(e){
    // Remove this key from the map
        delete keysdown[e.keyCode];

        if (e.key == 'a') {
            unpressStamp( $('#deny'));
        }
        if (e.key == 'd') {
            unpressStamp( $('#accept'));
        }

    });


    
    // Function to update the scale value dynamically from the transform property


    function isDraggable(e){

        const hasVisaSmolParent = $(e.target).parents('.visa-smol').length > 0;
        
        if (hasVisaSmolParent) {
            return true;
        }
        

        return !$(e.target).is('h6, p, span')
    }

    // Function to handle the dragging (delegated event listener for multiple elements)
    $(document).on('mousedown', '.draggable', function(e) {
    if (isDraggable(e)) {
        isDragging = true;
        e.stopPropagation();     

        $('body').css('user-select', 'none');
        $('body').css('cursor', 'none');
        window.getSelection().removeAllRanges();
        
        sound(choose(["paper-dragstart0.wav", "paper-dragstart1.wav", "paper-dragstart2.wav"]));

// Getting a random value

        getScaleFactor();
        var element = $(this);
        offsetX = (e.clientX - element.position().left / scale);
        offsetY = (e.clientY - element.position().top  / scale);

        
        draggable = element;
        // console.log("--------")
        // console.log('maus' + e.clientX)
        // console.log('offs' + offsetX)
        // console.log('posx' + element.position().left)
        // console.log('posx' + element.offset().left)
    
        // On mousemove, adjust the position based on the scaling factor
        $(document).on('mousemove', function(e) {
            if (isDragging) {
                // Get the updated scale factor
                getScaleFactor();
                // Calculate new position
                let newLeft = e.clientX - offsetX;
                let newTop =  e.clientY - offsetY;
                
                console.log(newLeft);
                if (newLeft > PaperBorderRight ) newLeft = PaperBorderRight;
                if (newLeft < PaperBorderLeft ) newLeft = PaperBorderLeft;
                if (newTop + element.height()  < PaperBorderTop ) newTop = PaperBorderTop - element.height();
                if (newTop  > PaperBorderBottom ) newTop = PaperBorderBottom;


                
                // Apply the scaling to the movement
                draggable.css({
                    top:  newTop   + 'px',
                    left: newLeft   + 'px',
                    position: 'absolute'
                });

                

                border = 600 - draggable.width() / 2; 
                smol = border > newLeft
                draggable.toggleClass('visa-smol', (smol))
                smolscale = smol ? 0.3 : 1.0;         
               
            }
        });
     }
    });
    
    // End dragging when mouse button is released
    $(document).on('mouseup', function() {
        isDragging = false;
        $(document).off('mousemove');
    
        // Re-enable text selection
        $('body').css('user-select', '');
        $('body').css('cursor', '');


        const visa = $('#visa')[0].getBoundingClientRect();
        const background = $('#boothbackground')[0].getBoundingClientRect();

        const isWithinBounds =
            visa.right <= background.right &&
            visa.bottom <= background.bottom;

        if (isWithinBounds){
            finalize();
        }
    });

    // Optional: Prevent default behavior when dragging
    $(document).on('dragstart', function(e) {
        e.preventDefault();
    });

    $(DragablePapers).on('mousedown', function(e) {
        console.log(paperZIndex);
        console.log("BUUUUUUUH");
        paperZIndex += 1;
        if (paperZIndex > 1000) {paperZIndex = 5}
        $(this).css('z-index', paperZIndex);
    });

    $(DragablePapers).on('mouseup', function(e) {
        sound(choose(["paper-dragstop0.wav", "paper-dragstop1.wav", "paper-dragstop2.wav"]));
    });

    // Apply the "draggable" class to any elements you want to be draggable
    $(DragablePapers).addClass('draggable');
    $(AppealMessage).addClass('draggable');
    // Example for multiple elements: $('.unban-requester-message').find('h6').addClass('draggable');
    

}




function setAvatars() {
    originalAvatarSrc = $('.hGPSMP').find('.tw-image-avatar').attr('src');
    

    var src = "";
    var switchsrc = "";
    if (streamerMode) {
        // Generate a random index and set a new avatar
        const randomIndex = Math.floor(Math.random() * 103);
        src = uri + `res/img/pfps/${randomIndex}.webp`;
        switchsrc = uri + 'res/img/ShutterSwitchDown.png'
    } else {
        // Revert to the original avatar
        src = originalAvatarSrc
        switchsrc = uri + 'res/img/ShutterSwitchUp.png'
    }

    $('#shutterSwitch img').attr('src', switchsrc);
    $('#personAvatar').attr('src', src);
    console.log("Original avatar:",  src);
    
    var img = document.getElementById('personAvatar');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    console.log("Original avatar:",  src);
    
    // Ensure the image is loaded before drawing
    img.onload = function() {
        
        // Reset canvas dimensions
        canvas.width = img.naturalWidth; // Use naturalWidth for original size
        canvas.height = img.naturalHeight; // Use naturalHeight for original size
        // Draw the first frame of the animated WebP onto the canvas
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
        var kurwa = document.getElementById('personAvatar');
        var src = kurwa.getAttribute('src'); // Get the 'src' attribute
        console.log("eeeeee: ", src); // Logs the source URL of the image

        context.drawImage(kurwa, 0, 0);

        // Convert the canvas to a data URL (static image)
        var staticImageURL = canvas.toDataURL('image/webp');

        // Update the <img> source with the static image
        $('#unban-request-details').find('.tw-image-avatar').attr('src', staticImageURL);

    };

    // If the image is already loaded, trigger onload manually
    if (img.complete) {
        img.onload();
    }

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
    console.log("playing: ", filename);
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

function twitchClickDenyUnban(unban=true){
    
    var buttons = $(UnbanDenyButton).toArray();

    if ( buttons.length == 1 ) {
        buttons[0].click();
    } 
    
    var buttons = $(UnbanDenyButton).toArray();
    if ( buttons.length != 2 ){
        alert("failure");
        return;
    }

    if(unban){
        buttons[1].click();
    }else{
        buttons[0].click();
    }

}


function userCard(){
    $('.unban-requests-item-header__title .bNYaHs.tw-link').click();
}


function pressStamp(obj, unban=false){
    if ($('#stamps').hasClass('stamp-hide')) return;
    
    stamp(unban);
    sound('stamp-down.wav')
    obj.css('transform', 'translateY(40px)');
}

function unpressStamp(obj){
    if ($('#stamps').hasClass('stamp-hide')) return;

    sound('stamp-up.wav')
    obj.css('transform', 'translateY(0px)');
}

var personUnban = false;

function stamp(unban){

    personUnban = unban;
    twitchClickDenyUnban(unban);   
    image = unban  ? uri + 'res/img/InkApproved.png' : uri + 'res/img/InkDenied.png';

        
        getScaleFactor();
        
        x = unban ? 1460 : 1105 ; // X coordinate where you want to stamp
        y = 560; // Y coordinate where you want to stamp

        // Get the offset of the paper
        const paperOffset = $('#visa').position(); // Get the offset of the paper

        // Calculate the adjusted coordinates
        const adjustedX = x  - paperOffset.left /scale; // Adjust X by the paper's left offset
        const adjustedY = y  - paperOffset.top  /scale;    // Adjust Y by the paper's top offset


        jiterX = Math.floor(Math.random() * 6) -  3  ;
        jitterY = Math.floor(Math.random() * 6) - 3  ;
        brightness = 1 - Math.random() / 3 ;

        // Create the image element
        const imgElement = $('<img />', {
            src: image, // Image URL
            class: 'stampInk',
            css: {
                position: 'absolute',
                left: jiterX + adjustedX + 'px',      
                top: jitterY + adjustedY + 'px',
                filter: `brightness(${brightness})`
            }
        });

        // Append the image to the paper (or any parent container)
        $('#visa').append(imgElement);
}

function finalize() {
    
    if ($('.stampInk').length == 0) return;

    occupied = false;
    if (personUnban) {
        leave('right');
    }else{
        leave('left');
    }

    $(ResolutionDiv).addClass('remove');
    $('#appeal').addClass('remove');
    $('#stamps').addClass('stamp-hide');

    $(ResolutionTextArea).val($('#resolutionNote').val());
    resetVisa();

}

function resetVisa(){
    
    $('textarea').blur(); 
    
    $('#visa').css({
        position: 'absolute', // Ensures it can be positioned
        left: '1300px',
        top:  '1080px'
    });

    $('.stampInk').remove();
    $('#visa').removeClass('visa-smol');


}


function resetPapers(){

    $(DragablePapers).addClass('draggable');

    $('#visa').animate({
        top: '930px'    // Move down
    }, {
        duration: 1000, // Duration in milliseconds
        easing: 'linear' // Linear easing
    });

    $('#resolutionNote').val('');

    setTimeout(function() {
        $('#appeal').addClass('visa-smol');
        $('#appeal').removeClass('remove');
        $(DragablePapers).addClass('draggable');

        $('#appeal p').html($('.unban-requester-message h6').html());

        $('#appeal').css({
          'top': '650px',
          'left': '300px',
        });
      }, 3000); // Delay in milliseconds

    $('#appeal').delay(3001)
    .animate({
        top: '730px'    // Move down
    }, {
        duration: 300, // Duration in milliseconds
        easing: 'linear' // Linear easing
    });

    $('.kndAiU').addClass('show');
    $('.kndAiU').removeClass('remove');


    sound('printer-feed.wav', 1666)
    sound('printer-feed.wav', 2332)
    sound('printer-feed.wav', 2998)
    sound('printer-tear.wav', 3350)

}


function next (){
    if (occupied) return;

    traveller_index += 1;
    
    const buttonsArray = $('.unban-requests-list-item').find('button').toArray();

    if (buttonsArray.length > traveller_index){

        occupied = true;
        sound('speech-announce.wav')
        
        const button = $(buttonsArray[traveller_index]);

        // Find the image source inside the .tw-image-avatar class within the button

        const randomSaturation = Math.max(0.1, Math.min(0.9, (Math.random() * 0.9 + 0.1).toFixed(2))); // Clamp between 0.1 and 0.8
        const randomHue = Math.floor(Math.random() * 360); // 0 to 360
        $('#personBody').css('filter', `saturate(${randomSaturation}) hue-rotate(${randomHue}deg)`);
        walk_in();

        // show papers
        button.click();
        resetPapers();

        setTimeout(function() {
            setAvatars();
        }, 500);


        


        
    }else{
        traveller_index = buttonsArray.length - 1;
    }

    console.log(traveller_index);

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
        // walke.remove(); // Completely remove the image element
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
    fadeOutAudio(music, 1000);
    sound('booth-intro.wav')
    // sound('booth-ambient.wav', 0, true)
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
        const baseWidth = 1920;
        const baseHeight = 1080;

        // Function to scale the entire body element based on the current viewport
        function scaleToFitViewport() {
            const scaleX = window.innerWidth / baseWidth;
            const scaleY = window.innerHeight / baseHeight;
            const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

            // Scale the body
            $('body').css({
                transform: 'scale(' + scale + ')',
                width: baseWidth + 'px',
                height: baseHeight + 'px',
            });

            // Center the body in the viewport (if necessary)
            $('body').css({
                left: (window.innerWidth - (baseWidth * scale)) / 2 + 'px',
                top: (window.innerHeight - (baseHeight * scale)) / 2 + 'px',
                position: 'absolute',
            });
        }

        // Call the function initially
        scaleToFitViewport();

        // Recalculate scaling on window resize
        $(window).resize(function() {
            scaleToFitViewport();
        });

        console.log("jQuery has been loaded and is ready to use.");
        
        // Inject external HTML into #content div
        const newDiv = $('<div id="sus"></div>').text('This is a dynamically created div!');
        
        // Inject external CSS by appending it to the head of the document
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: uri + 'style.css'
        }).appendTo('head');
      
        // $('<link/>', {
        //     rel: 'stylesheet',
        //     type: 'text/css',
        //     href: 'https://code.jquery.com/ui/1.14.0/themes/base/jquery-ui.css'
        // }).appendTo('head');
        
        newDiv.load(uri + 'content.html', function(data) {
            // Replace __URL__ in the loaded content with the actual URL
            const modifiedContent = data.replace(/URL/g, uri);
            
            // Set the modified content to the new div
            newDiv.html(modifiedContent);
        });

        $('body').append(newDiv);
        
                



    });
});


