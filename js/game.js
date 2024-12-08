
var uri = new URL('http://flourek.github.io/unbanplease/');

var occupied = false;
var lastTraveller = false;
var scale = 1; // Default scale
var paperZIndex = 5;
var isDragging = false;
var personUnban = false;
var keysdown = {};  // tracks which keyboard keys are currently held

var streamerMode = false;
var originalAvatarSrc;

var queue;  // js array of <button> found in the sidebar with the appeals
var numberOfAppeals = 0;
var appealsDenied = 0;
var appealsAccepted = 0
var ShotTravelers = 0;
var sniping = false;

const baseWidth = 1920;
const baseHeight = 1080;

const UnbanDenyButton = '#visa .cmxSxj';
const SendUnbanDecisionButton = '#visa .khjbBN';
const ResolutionDiv = '.kndAiU';
const ResolutionTextArea = '.gzFSTs textarea';
const DragablePapers = '#visa, #unban-request-details, #appeal, .moneyWrapper'
const AppealMessage = '.unban-requester-message'

const PaperBorderRight = 1776;
const PaperBorderTop = 400;
const PaperBorderLeft = 110;
const PaperBorderBottom = 980;

let music = new Audio(uri + 'res/snd/Theme.wav');
music.loop = true; // Set looping



$(document).ready(function() {

    setupChatVoting();

    $('title').text('UNBAN PLEASE');

    // Call the function initially
    scaleToFitViewport();

    // Recalculate scaling on window resize
    $(window).resize(function() {
        scaleToFitViewport();
        getScaleFactor();
    });



    console.log("Page loading completed. Executing your code...");

    $('#logo').css({display: 'block'});
    music.play();

    mouseBinds();

    keyboardBinds();
    
    var draggable;
    var offsetX, offsetY; // Variables to store the offset

    // Function to handle the dragging (delegated event listener for multiple elements)
    $(document).on('mousedown', '.draggable', function(e) {

        // pulls the selected paper to front
        console.log("Paper Z-Index: ", paperZIndex);
        paperZIndex += 1;
        if (paperZIndex > 1000) {paperZIndex = 5}
        if($(this).hasClass('visa-smol')){
            $(this).css('z-index', paperZIndex + 1005);
        }else{
            $(this).css('z-index', paperZIndex);
        }


    if (isDraggable(e)) {
        isDragging = true;
        e.stopPropagation();     
        sound(choose(["paper-dragstart0.wav", "paper-dragstart1.wav", "paper-dragstart2.wav"]));
        
        // remove text selection and cursor
        $('body').css('user-select', 'none');
        // $('body').css('cursor', 'none');
        window.getSelection().removeAllRanges();
        
        getScaleFactor();
        var element = $(this);
        draggable = element;
        paperDimensions = getScaledDimensions(draggable);
        paperScale = paperDimensions.transformScale;
        smolBorder = $("#boothbackground").offset().left +  $("#boothbackground").width() * scale

        offsetX = (e.clientX - element.position().left) / scale / paperScale;
        offsetY = (e.clientY - element.position().top)  / scale / paperScale;
        transitionScale = 1;

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                
                smol = smolBorder > e.clientX;
                wasSmol = draggable.hasClass('visa-smol');
                draggable.toggleClass('visa-smol', smol)
                if(wasSmol != draggable.hasClass('visa-smol')){
                    transitionScale = getScaledDimensions(draggable).transformScale * scale;
                }
              
                    
                let newLeft = e.clientX / scale - offsetX * paperScale * transitionScale;
                let newTop =  e.clientY / scale - offsetY * paperScale * transitionScale;

                if (newLeft > PaperBorderRight ) newLeft = PaperBorderRight;
                if (newLeft < PaperBorderLeft ) newLeft = PaperBorderLeft;
                if (newTop  > PaperBorderBottom ) newTop = PaperBorderBottom;
                if (newTop  + getScaledDimensions(draggable).height  < PaperBorderTop ) newTop = PaperBorderTop - getScaledDimensions(draggable).height;

                // Apply the scaling to the movement
                draggable.css({
                    top:  newTop   + 'px',
                    left: newLeft   + 'px',
                    position: 'absolute',
                    'z-index': paperZIndex + (smol ? 1005 : 0)
                });
                
            }
        });
     }
    });

    $(document).on('mouseup', '.draggable', function() {
        sound(choose(["paper-dragstop0.wav", "paper-dragstop1.wav", "paper-dragstop2.wav"]));
        tryGiveVisa();
    });

    // End dragging when mouse button is released
    $(document).on('mouseup', function() {
        isDragging = false;
        $(document).off('mousemove');
    
        // Re-enable text selection
        $('body').css('user-select', '');
        $('body').css('cursor', '');

 
    });

    $(document).on('dragstart', function(e) {
        e.preventDefault();
    });


});


function mouseBinds(){
      // Mouse
    $('#accept').mousedown(function() {
        pressStamp($(this), true);
    });

    $('#deny').mousedown(function() {
        pressStamp($(this), false);
    });
    
    $('.stampButton').mouseup(function() {
        sound('stamp-up.wav')
    });


    $(document).mouseup(function() {
        $('.stampButton').each(function() {
            unpressStamp($(this));
        });
    });

    $('#borderContainer').mousedown(function(e) {
        snipe();
    });
    
    $('#snipeMask *').mousedown(function(e) {
        if(!sniping) return;
        timeoutRandom();
        position = {left: (e.clientX - 20) / scale, top: (e.clientY - 35) / scale};
        console.log(scale);
        spawnDeadTraveler(position);
    });

}


function toggleAwpShelf(){
    if ( $('#awp').hasClass('showAwp') ){
        $('#awp').animate({right: '-512px'}, 400);
        sound('stampbar-close.wav')
    }else{
        $('#awp').animate({right: '46px'}, 400);
        sound('stampbar-open.wav')
    }
    $('#awp').toggleClass('showAwp');
}

function snipe(){
    if (!sniping) return;
    sound('AWP.wav');
    
    var $element = $("#borderContainer");
    $element.css("filter", "brightness(100%)");

    // Animate back to normal brightness (1) in 0.5 seconds
    $({brightness: 5}).animate({brightness: 1}, {
        duration: 330,
        easing: 'linear',
        step: function (now) {
            // Update the filter property based on the current value of brightness
            $element.css("filter", "brightness(" + now + ")");
        }
    });



}

function toggleAwpEquipped(){
    if ( $('#awp').hasClass('awpEquipped') ){
        $('#awp img').attr('src', uri + 'res/img/awpStored.png');
        $('.travelerWalking, .travelerDead').removeClass('snipingCursor')
        sound('rifle-keyinsert.wav')
        sniping = false;
    }else{
        $('#awp img').attr('src', uri + 'res/img/awpEmpty.png');
        $('.travelerWalking, .travelerDead').addClass('snipingCursor')
        sound('rifle-cock.wav')
        sniping = true;
    }

    $('#borderContainer').toggleClass('snipingCursor');
    $('#awp').toggleClass('awpEquipped');
}

function spawnAcceptedTraveler(){
    

    const traveler = $('<img />', {
        src: uri + 'res/img/travellerWalking.gif?' + new Date().getTime(), // Image URL
        class: 'travelerWalking',
        css: {
            left: '690px',      
            top: '280px'
        }
    });

    $('#borderContainer').append(traveler);
    makeTravelerShootable();
    
    traveler.animate(
        { left: '1500px' }, 
        {
            duration: 30000, // Animation duration in milliseconds
            easing: 'linear', // Linear easing
        }

    ).animate({top: '400px'}, 2500);
    
    setTimeout(function() {
        traveler.remove(); // Completely remove the image element
    }, 40000);
}

function spawnDeniedTraveller(){
    
    const traveler = $('<img />', {
        src: uri + 'res/img/travellerWalking.gif?' + new Date().getTime(), // Image URL
        class: 'travelerWalking travelerDenied',
        css: {
            left: '525px',      
            top: '280px'
        }
    });

    $('#borderContainer').append(traveler);
    makeTravelerShootable();
    
    traveler.animate(
        { left: '440px', top: '310px' }, {
            duration: 2600, // Animation duration in milliseconds
            easing: 'linear', // Linear easing
        }

    ).animate({left: '-100px'}, {
        duration: 14000, // Animation duration in milliseconds
        easing: 'linear', // Linear easing
    });
    
    setTimeout(function() {
        traveler.remove(); // Completely remove the image element
    }, 13000);

}

function makeTravelerShootable(){
    $('.travelerWalking').mousedown(function() {
        if(!sniping) return;
        spawnDeadTraveler(getScaledDimensions($(this)));
        $(this).remove();
    });
}

function spawnDeadTraveler(position){

    ShotTravelers++;
    getScaleFactor();

    const travelerDead = $('<img />', {
        src: uri + 'res/img/travellerDeath.webp?' + new Date().getTime(), // Image URL
        class: 'travelerDead',
        css: {
            left: position.left,
            top: position.top + Math.floor(Math.random() * 20),
            position: 'absolute'
        }
    });

    $('#borderContainer').append(travelerDead);
}



function keyboardBinds() {
        
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
        if (($('textarea').is(':focus') || $('.tw-input').is(':focus'))  && !isDragging){
            sound(choose(["text-reveal0.wav", "text-reveal1.wav", "text-reveal2.wav", "text-reveal3.wav"]));
            // $(ResolutionTextArea).val($('#resolutionNote').val());
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
            pressStamp($('#accept'), true);
        }
        if (e.key == 'd') {
            pressStamp($('#deny'), false);
        }

    });

    $(document).keyup(function(e){
    // Remove this key from the map
        delete keysdown[e.keyCode];

        if (e.key == 'a') {
            unpressStamp( $('#accept'));
        }
        if (e.key == 'd') {
            unpressStamp( $('#deny'));
        }

    });

};

// Function to scale the entire body element based on the current viewport
function scaleToFitViewport() {
    const screenWidth =  1920;
    const screenHeight = 1080;
    const scaleX = window.innerWidth / screenWidth;
    const scaleY = window.innerHeight / screenHeight;
    const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

    // Scale the body
    $('body').css({
        transform: 'scale(' + scale + ')',
        width: screenWidth + 'px',
        height: screenHeight + 'px',
    });

    // Center the body in the viewport (if necessary)
    $('body').css({
        left: (window.innerWidth - (screenWidth * scale)) / 2 + 'px',
        top: (window.innerHeight - (screenHeight * scale)) / 2 + 'px',
        position: 'absolute',
    });
}

function getScaledDimensions(element) {
    
    getScaleFactor();
    pos = element.position();


    const originalHeight = element.outerHeight();
    const originalWidth =  element.outerWidth();

    // Get the computed style to find the transform
    const computedStyle = element.css('transform');
    
    // Initialize scale factors
    let scaleX = 1;
    let scaleY = 1;

    // If there is a transform applied
    if (computedStyle && computedStyle !== 'none') {
        // Extract the scale factors from the matrix
        const matrixValues = computedStyle.match(/matrix\(([^)]+)\)/);
        if (matrixValues) {
            const values = matrixValues[1].split(', ');
            scaleX = parseFloat(values[0]); // Scale X is the first value
            scaleY = parseFloat(values[3]); // Scale Y is the fourth value
        }
    }

    console.log(scale, scaleX, scaleY);
    return {
        top: pos.top / scale,
        left: pos.left / scale,
        height: originalHeight * scaleY,
        width: originalWidth   * scaleX,
        transformScale: scaleX
    };

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





function tryGiveVisa(){
   
    if (!isVisaStamped()) return; 

    const visa = $('#visa')[0].getBoundingClientRect();
    const background = $('#boothbackground')[0].getBoundingClientRect();

    const isWithinBounds =
        visa.right  <= background.right &&
        visa.bottom <= background.bottom;

    if (isWithinBounds){
        sound('givetake-swish.wav');
        finalize();
        $('#visa').css({  left: '1300px', top:  '1080px'})
    }
}


function isDraggable(e){

    const hasVisaSmolParent = $(e.target).parents('.visa-smol').length > 0;
    
    if (hasVisaSmolParent) {
        return true;
    }

    return !$(e.target).is('h6, p, span')
}


function setAvatars() {
    // Get OG avatar from the sidebar
    originalAvatarSrc = $('.hGPSMP').find('.tw-image-avatar').attr('src');
    var src = "";
    var switchsrc = "";

    if (streamerMode) { // censored
        const randomIndex = Math.floor(Math.random() * 103);
        src         = uri + `res/img/pfps/${randomIndex}.webp`;
        switchsrc   = uri + 'res/img/ShutterSwitchDown.png'
    } else { // original
        src         = originalAvatarSrc
        switchsrc   = uri + 'res/img/ShutterSwitchUp.png'
    }

    // set the images
    $('#shutterSwitch img').attr('src', switchsrc);
    $('#personAvatar').attr('src', src);
    
    // Generate a static image of the potentially animated avatar
    var img = document.getElementById('personAvatar');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    img.onload = function() {
        
        // Reset canvas 
        canvas.width = img.naturalWidth;   
        canvas.height = img.naturalHeight; 
        context.clearRect(0, 0, canvas.width, canvas.height); 

        var kurwa = document.getElementById('personAvatar');
        var src = kurwa.getAttribute('src'); 
        context.drawImage(kurwa, 0, 0);

        var staticImageURL = canvas.toDataURL('image/webp');

        $('#unban-request-details').find('.tw-image-avatar').attr('src', staticImageURL);

    };

    // If the image is already loaded, trigger onload manually
    if (img.complete) {
        img.onload();
    }

}


function sound(filename, delay=0, loop=false){
    console.log("playing: ", filename);
    var audio = new Audio(uri + 'res/snd/' + filename);
    audio.loop = loop;

    // Check if audio is loaded before playing
    audio.addEventListener('canplaythrough', () => {
        setTimeout(function(){ 
            audio.play();
        }, delay);
    }, { once: true });

    // Start loading the audio
    audio.load();


}


function stampsToggle () {
    $('#stamps').toggleClass('stamp-hide');

    if ($('#stamps').hasClass('stamp-hide')){
        sound('stampbar-close.wav')
    }else{
        sound('stampbar-open.wav')
    }
}


function twitchClickDenyUnban(unban=true){
    
    var gzftbsContent = $('.loBtjK').detach();
    $('#visa').append(gzftbsContent);
    
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

function twitchSortByOldest(){
    $('.kkKgFB').val('OLDEST').change();
}


function toggleUserCard(){
    $('.viewer-card-layer').toggleClass('showUserCard');
}


function pressStamp(obj, unban=false){
    if ($('#stamps').hasClass('stamp-hide')) return;
    
    stamp(unban);
    sound('stamp-down.wav')
    obj.css('transform', 'translateY(40px)');
}

function unpressStamp(obj){
    if ($('#stamps').hasClass('stamp-hide')) return;

    obj.css('transform', 'translateY(0px)');
}


function stamp(unban){

    personUnban = unban;
    twitchClickDenyUnban(unban);   
    image = unban  ? uri + 'res/img/InkApproved.png' : uri + 'res/img/InkDenied.png' ;
    
    // stamping center position 
    x = unban ?  1105 : 1460 ;  
    y = 560;                   
    
    // Visa position
    const paperOffset = $('#visa').position(); // Get the offset of the paper
    
    // Calculate the resulting stamp coordinates
    getScaleFactor();
    const adjustedX = x  - paperOffset.left /scale; // Adjust X by the paper's left offset
    const adjustedY = y  - paperOffset.top  /scale;    // Adjust Y by the paper's top offset

    // Calculate randomness to stamp's position
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

    // Append the image to visa 
    $('#visa').append(imgElement);
}

// send the person away, banning/unbanning them, clear all papers
function finalize() {
    
    // wait for person animation to finish
    setTimeout( function (){
        occupied = false;
    }, 2000);

    if (personUnban) {
        leave('right');
        appealsAccepted += 1;
    }else{
        leave('left');
        appealsDenied += 1;
    }

    
    const element = document.querySelector(SendUnbanDecisionButton);
    element.focus();
    element.click(); 
    
    element.blur();
    $('textarea').blur(); 
    $('#unban-request-details, #appeal, .moneyWrapper, .citation').addClass('remove');
    setTimeout(() => {
        $('.moneyWrapper, .citation').remove();
    }, 500);
    $('#stamps').addClass('stamp-hide');
    
    updateCounter();
    shouldEnd();
}

function isVisaStamped() {
    if ($('.stampInk').length == 0){
        console.log('no inks!');
        return false;

    } 
    
    const visa = $('#visa');
    const visaOffset = visa.offset();
    visaTransformed = getScaledDimensions(visa);
    const visaWidth = visaTransformed.width
    const visaHeight = visaTransformed.height;

    let isWithin = false;

    $('.stampInk').each(function() {
        const stampInk = $(this);
        const stampInkOffset = stampInk.offset();
        stampInkTransformed = getScaledDimensions(stampInk);
        const stampInkWidth = stampInkTransformed.width
        const stampInkHeight = stampInkTransformed.height

        // Check if stampInk is within the bounds of visa
        const withinX = (
            stampInkOffset.left < visaOffset.left + visaWidth &&
            stampInkOffset.left + stampInkWidth > visaOffset.left
        );
        const withinY = (
            stampInkOffset.top < visaOffset.top + visaHeight &&
            stampInkOffset.top + stampInkHeight > visaOffset.top
        );

        if (withinX && withinY) {
            isWithin = true;
            return; // Break out of the .each loop
        }
    });

    console.log("wewe: ", isWithin)
    return isWithin;
}


function getAppealsCount(){
    const requestsCountElement = $('.unban-requests-sidebar__requests-count h6');
    return parseInt(requestsCountElement.attr("title").match(/\d+/)[0]);
}

function updateCounter(){
    const result = `${appealsAccepted + appealsDenied}/${numberOfAppeals} | Accepted: ${appealsAccepted} | Denied: ${appealsDenied} | Bans: ${newBans} `;
    $('#countText').html(result);
}


function next (){
    if (occupied) return;

    if ($('.ieOTqj').length > 0) {
        ending();
        return;
    }
    
    

    appealsDone = appealsDenied + appealsAccepted;
    
    if (numberOfAppeals >= appealsDone){
        
        occupied = true;
        resetVotes();

        sound('speech-announce.wav')
        sound('traveler-walkin.wav', 1500);
        sound('speech-inspector.wav', 2500);

        walk_in();

        resetPapers();

        if (numberOfAppeals == appealsDone){
            sound('border-foghorn.wav', 5000);
            lastTraveller = true;

        }
        
    }else{
        occupied = true;
    }


}


function shouldEnd(){
    if (lastTraveller === true){
        setTimeout( function(){
            ending();
        }, 3000);
    }
}



