const main = document.querySelector('.main');
const signIn = document.querySelector('.sign-in-btn')
const signUp = document.querySelector('.sign-up-btn')


function init() {
    main.addEventListener('click',function() {
        window.location.href = '/'  
    })
      
    signUp.addEventListener('click',function() {
        window.location.href = '/signup.html'  
    })    
    
    signIn.addEventListener('click',function() {
        var email = document.querySelector('#email').value;
        var pw = document.querySelector('#pw').value;
        firebase.auth().signInWithEmailAndPassword(email,pw)
        .catch((err) => {
            document.querySelector('#email').value = '';
            document.querySelector('#pw').value = '';
            alert('사용자 정보가 일치하지 않습니다!')

        }).then((result)=>{
            console.log(result.user)
            window.location.href = '/'            
            alert('로그인 되었습니다!')
        })
    })
}

init()