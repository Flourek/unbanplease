

function resetPapers(){

    $(DragablePapers).addClass('draggable');
    $('#visa .loBtjK').remove();

    // reset visa and the textarea in it, remove stamps
    setTimeout(function() {
        sound('paper-spit.wav', 100);

        $('#resolutionNote').val('');
        $('.stampInk').remove();
        $('#visa').removeClass('remove');
        $('#visa').removeClass('visa-smol');
        $('#visa')
            .css({  left: '1300px', top:  '1080px'})
            .animate({top: '930px'}, 500);     
    }, 500);

    // reset the yellow appeal
    setTimeout(function() {
        $('#appeal').addClass('visa-smol');
        $('#appeal').removeClass('remove');
        
        $('#appealContent').html($('.unban-requester-message h6').html());
        applyHandwritingEffect();


        $('#appeal')
            .css({'top': '650px', 'left': '300px', 'z-index': paperZIndex + 1005 + 1})
            .animate({ top: '730px'}, 300)  

      }, 3000); // Delay in milliseconds



    // reset the details with messages
    $('.kndAiU').removeClass('show');
    censorText("#unban-request-details");
    getFollowInfo();
    adjustTextColorIfCloseToWhite('.message-author__display-name', 230, '#555'); //

    // relpace emotes
   $('.text-fragment').each(function() {
        // Get the current HTML content of the element
        var currentText = $(this).html();

        // Replace the text using the replaceText function
        var newText = replaceEmotes(currentText);

        // Set the new HTML content back to the element
        $(this).html(newText);
    });

    setTimeout(function() {
        
        $('.kndAiU').addClass('show');
        $('.kndAiU').removeClass('remove');
    
        $('#unban-request-details')
            .css({ top: '1180px' }) 
            .animate({ top: "-=200px" }, 300, function() {sound('printer-feed.wav', 0);  })
            .delay(333)
            .animate({ top: "-=200px" }, 300, function() {sound('printer-feed.wav', 0);  })
            .delay(333)
            .animate({ top: "-=200px" }, 300, function() {sound('printer-feed.wav', 0);  })
            .delay(333)
            .animate({ top: "-=200px" }, 300, function() {sound('printer-tear.wav', 0);  })

        $(DragablePapers).addClass('draggable');

        // Example usage



        
    }, 2000); // Delay in milliseconds

    setTimeout(function() {
        setAvatars();
    }, 500);

}

function getFollowInfo(){
    $('.unban-requests-item-header__title .tw-link').click();
    
    const interval = setInterval(() => {
        const element = $('.viewer-card-header__display-name');

        if (element.length > 0 && element.text().trim() !== '') {
            clearInterval(interval); // Stop polling
            $('.unban-requests-item-header__title').html(element.clone());
        }
    }, 100); // Check every 100ms
}




function personStep(){
    $("#person")
        .animate({  top: '+=10px'}, 300)
        .animate({  top: '-=10px'}, 300)
        .animate({  top: '+=10px'}, 300)
        .animate({  top: '-=10px'}, 300)
        .animate({  top: '+=10px'}, 300)
        .animate({  top: '-=10px'}, 300)
        .animate({  top: '+=10px'}, 300)
        .animate({  top: '-=10px'}, 300)
        .animate({  top: '+=10px'}, 300)
        .animate({  top: '-=10px'}, 300)
}

function walk_in (){
    sound('traveler-walkin.wav');

    // change shirt color
    const randomSaturation = Math.max(0.1, Math.min(0.9, (Math.random() * 0.9 + 0.1).toFixed(2))); // Clamp between 0.1 and 0.8
    const randomHue = Math.floor(Math.random() * 360); // 0 to 360
    $('#personBody').css('filter', `saturate(${randomSaturation}) hue-rotate(${randomHue}deg)`);
    
    const walke = $('<img>', {
        class: 'walk_in',
        src: uri + 'res/img/walk_in.png?' + new Date().getTime()
    }).appendTo('#sus');

    setTimeout(function() {
        walke.remove(); // Completely remove the image element
    }, 2500);
    
    $("#person")
        .css({ left: '-400px', filter: 'brightness(0.2)', top: '90px' })
        .animate(
            { left: '200px' }, 
            { duration: 3000, queue: false, complete: function() {
                $("#person").css("filter", "brightness(1.0)"); 
                $("#person").addClass("personBreathing");
            }}
        );

    personStep();
}

function leave(dir='left'){

    $("#person").removeClass("personBreathing");
    personStep();
    sound('traveler-walkout.wav');

    if(dir==='left') {

        $("#person")
            .css({ filter: 'brightness(0.2)', top: '90px' })
            .animate(
                { left: '-400px' }, 
                { duration: 3000, queue: false }
            );
        
        setTimeout(function() {
            spawnDeniedTraveller();
        }, 2000);


    }else if (dir==='right'){
        
        
        $("#person")
            .css({ filter: 'brightness(0.2)', top: '90px' })
            .animate(
                { left: '800px' }, 
                { duration: 3000, queue: false }
            );
        
        setTimeout(function() {
            spawnAcceptedTraveler();
        }, 2000);
    }
}


function setReadableFont(){
    $('#appealContent').attr('style', `  font-family: papers !important; font-size: 24px !important;  color: #333  !important`);
}

function applyHandwritingEffect() {
    censorText("#appealContent");
    setRandomFont('#appealContent');
}


function giveMoney(){

    const moneyWrapper = $('<div />', {
        class: 'moneyWrapper visa-smol draggable',
        css: {
            left: '300px', // Wrapper position
            top: '650px',  // Wrapper position
            'z-index': 1003
        }
    });
   
    
    const randomAngle = (Math.random() * 20) - 10; // Random value in range [-5, 5]
    
    // Create the money element with a random rotation
    const moneyImg = $('<img />', {
        src: uri + 'res/img/MoneyInner5.png',
        class: 'money',
        css: {
            left: '300px',
            top: '650px',
            transform: `rotate(${randomAngle}deg)` // Apply random rotation
        }
    });
    moneyWrapper.append(moneyImg);
    
    $('#sus').append(moneyWrapper);
    const randomY = Math.floor(Math.random() * 60);
    const randomX = Math.floor(Math.random() * 80);
    moneyWrapper.animate({ top: `${740 + randomY}px`, left: `${280 + randomX}px` }, 300);
}


function citation (text) {

    // Create the new citation element
    const newCitation = $(`
        <div class="citation draggable">
            <img src="${uri}res/img/Citation.png" alt="">
            <p>${replaceEmotes(text)}</p>
        </div>
    `);
    

    // Append the new element to #sus
    $('#sus').append(newCitation);
    sound('printer-line.wav');
    newCitation.css({ 'z-index': paperZIndex + 1});
    newCitation.animate({ top: '848px'});
}


function setRandomFont(element) {
    const fonts = [
        'QEDaveMergens'
        // 'QEAntonyLark',
        // 'QEBradenHill',
        // 'QECarolineMutiboko',
        // 'QEGHHughes',
        // 'QEHerbertCooper'
    ];


    const randomFont = choose(fonts);
    const blueShade = `rgb(${Math.floor(Math.random() * 90)}, ${Math.floor(Math.random() * 90)}, ${Math.floor(Math.random() * 256)})`;
    // Apply the font to the specified element
    $(element).attr('style', `  font-family:    ${randomFont}   !important; 
                                font-size:      32px            !important;
                                color:          ${blueShade}    !important;`);
}


function start() {
    $('.black-screen').addClass("black-screen-hide");
    fadeOutAudio(music, 1000);
    sound('booth-intro.wav');
    numberOfAppeals=getAppealsCount()
    updateCounter();
    // sound('booth-ambient.wav', 0, true)
}

function ending(){
    $('#statsApproved').html(`APPROVED: ${appealsAccepted}`);
    $('#statsDenied').html(`DENIED: ${appealsDenied}`);
    $('#statsBans').html(`NEWLY BANNED: ${newBans}`);
    $('#statsShot').html(`PEOPLE SHOT: ${ShotTravelers}`);

    $('#ending')
        .css({display: 'flex'})
        .animate({opacity: '1'}, 500);     
        
    $(document).off("keydown");
    sound('Victory.wav');
}



function adjustTextColorIfCloseToWhite(selector, threshold, replacementColor) {
    $(selector).each(function () {
        // Get computed color of the element
        let color = $(this).css("color");

        // Create a hidden div to parse the color to RGB
        let $tempDiv = $('<div>').css("color", color).appendTo('body');
        let computedColor = $tempDiv.css("color");
        $tempDiv.remove();

        // Extract RGB components
        let match = computedColor.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (match) {
            let r = parseInt(match[1]);
            let g = parseInt(match[2]);
            let b = parseInt(match[3]);

            // Check if the color is close to white
            if (r > threshold && g > threshold && b > threshold) {
                $(this).css("color", replacementColor);
            }
        }
    });
}

