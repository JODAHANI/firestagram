const firebaseConfig = {
    apiKey: "AIzaSyCcJsMzwcKFMsxFXOMi2zC6-0wBWvakm_E",
    authDomain: "firetube-88c12.firebaseapp.com",
    projectId: "firetube-88c12",
    storageBucket: "firetube-88c12.appspot.com",
    messagingSenderId: "181384418570",
    appId: "1:181384418570:web:55f577c95d1489f80296f3",
    measurementId: "G-33MKEWVQ7J"

};

firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();
const storage = firebase.storage();

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
        }); 
    })    
    
    signIn.addEventListener('click',function() {
        window.location.href = '/signin.html'  
    })


    
}

init();