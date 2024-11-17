

function resetPapers(){

    $(DragablePapers).addClass('draggable');

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
            .css({'top': '650px', 'left': '300px', })
            .animate({ top: '730px'}, 300)  

      }, 3000); // Delay in milliseconds



    // reset the details with messages
    $('.kndAiU').removeClass('show');

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
        twitchClickDenyUnban(false);
        censorText("#unban-request-details");
        // $('.iNjobR').scrollTop($('.iNjobR')[0].scrollHeight);


        
    }, 2000); // Delay in milliseconds

    setTimeout(function() {
        twitchClickDenyUnban(false);
        setAvatars();
    }, 500);


    


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
        
        
        $("#person")
            .css({ filter: 'brightness(0.2)', top: '90px' })
            .animate(
                { left: '800px' }, 
                { duration: 3000, queue: false }
            );

        spawnAcceptedTraveler();
    }
}


function setReadableFont(){
    $('#appealContent').attr('style', `  font-family: papers !important; font-size: 24px !important;  color: #333  !important`);
}

function applyHandwritingEffect() {
    censorText("#appealContent");
    setRandomFont('#appealContent');
}




function setRandomFont(element) {
    const fonts = [
        'QEDaveMergens',
        'handwriting',
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
    $('#ending')
        .css({display: 'flex'})
        .animate({opacity: '1'}, 500);     
        
    $(document).off("keydown");
    sound('Victory.wav');
}
