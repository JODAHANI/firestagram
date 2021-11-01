function signOut() {
    firebase.auth().signOut()
    alert('로그아웃 되었습니다.')
    localStorage.removeItem('user')
    $('.sign-out').removeClass('on');
    $('a.sign').css(`display`, `inline-block`)   
}

function init() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            localStorage.setItem('user',JSON.stringify(user))
            loginData();        
        }
    
    });
    
    function loginData(){
        let currentUser = localStorage.getItem('user')
        if(currentUser !== null) {
            $('a.sign').css(`display`, `none`)        
            $('.sign-out').addClass('on');
        } 
        
    }
    
  
}


init();
