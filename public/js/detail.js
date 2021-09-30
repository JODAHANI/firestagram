let screen_Size = window.innerWidth;
if(screen_Size < 1031) {
    $('.post-header').addClass('on')
} else if(screen_Size > 1030) {
    $('.post-header').removeClass('on')
}


$(window).on('resize',()=> {
    let screen_Size = window.innerWidth;
    if(screen_Size < 1031) {
        $('.post-header').addClass('on')
    } else if(screen_Size > 1031) {
        $('.post-header').removeClass('on')
    }
})