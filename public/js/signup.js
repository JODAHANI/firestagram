const main = document.querySelector('.main');
const signIn = document.querySelector('.btn-sign-in')
const signUp = document.querySelector('.btn-sign-up')
const email = document.querySelector('.email');


function init() {
    main.addEventListener('click',function() {
        window.location.href = '/'  
    })
      
    signUp.addEventListener('click',function() {
        const email = document.querySelector('#email').value;
        const pw = document.querySelector('#pw').value;
        const name = document.querySelector('#name').value;

        firebase.auth().createUserWithEmailAndPassword(email, pw)
        .then((reuslt) => {
            reuslt.user.updateProfile({displayName : name})
            console.log(reuslt.user)
            document.querySelector('#email').value = '';
            document.querySelector('#pw').value = '';
            document.querySelector('#name').value = '';
            alert('로그인 부탁드립니다!')
        }); 
    })    
    
    signIn.addEventListener('click',function() {
        window.location.href = '/signin.html'  
    })


    
}

init();

// const main = document.querySelector('.main');
// const signIn = document.querySelector('.btn-sign-in')
// const signUp = document.querySelector('.btn-sign-up')


// function init() {
//     main.addEventListener('click',function() {
//         window.location.href = '/'  
//     })
      
//     signUp.addEventListener('click',function() {
//         const email = document.querySelector('#email').value;
//         const pw = document.querySelector('#pw').value;
//         const name = document.querySelector('#name').value;
//         firebase.auth().createUserWithEmailAndPassword(email, pw)
//         .then((reuslt) => {
//             let userData = {
//                 name : name,
//                 email : email
//             }
//             db.collection('user').doc(reuslt.user.id).set(userData);
//             reuslt.user.updateProfile({displayName : name})
//             console.log(reuslt.user)
//             document.querySelector('#email').value = '';
//             document.querySelector('#pw').value = '';
//             document.querySelector('#name').value = '';
//         }); 
//     })    
    
    
//     signIn.addEventListener('click',function() {
//         window.location.href = '/signin.html'  
//     })
    
// }

// init();

