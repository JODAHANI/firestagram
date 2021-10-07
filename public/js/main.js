const db = firebase.firestore();
const storage = firebase.storage();

const input = document.querySelector('.inputfile');
const uploadPage = document.querySelector('.upload-page');
const uploadImage1 = document.querySelector('.upload-image1');
const uploadImage2 = document.querySelector('.upload-image2');
const prev = document.querySelector('.btn.prev'); 
const next = document.querySelector('.btn.next');
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');
const writeBox = document.querySelector('.write-box');

let step = 0;


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        localStorage.setItem('user',JSON.stringify(user))
        로그인정보();        
    }

});


function 로그인정보(){
    let 뺀거 = localStorage.getItem('user')
    if(뺀거 !== null) {
        $('a.sign').css(`display`, `none`)        
        $('.sign-out').addClass('on');
    } 
    
}

function signOut() {
    firebase.auth().signOut()
    alert('로그아웃 되었습니다.')
    localStorage.removeItem('user')
    $('.sign-out').removeClass('on');
    $('a.sign').css(`display`, `inline-block`)   
}





function btnControll(file) {
    next.addEventListener('click', () => {
        if(step == 0) {
            step ++;
            box1.style.display = "none"
            box2.style.display = "block"
            next.innerText = 'Sub'
        } else if(step == 1) {
            let storageRef = storage.ref();
            let 저장할경로 = storageRef.child('image/' + file.name);
            let uploadTask = 저장할경로.put(file);
            uploadTask.on( 'state_changed',
                null,
                (error) => {
                    console.error('실패사유는', error);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        console.log('업로드된 경로는', url)
                        let user = JSON.parse(localStorage.getItem('user'));
                        let saveData = {
                            올린사람: user.displayName,
                            좋아요수: 0,
                            content: writeBox.value,
                            date : new Date(),
                            img : url,
                            댓글: [],
                            좋아요눌린사람 :[]
                        }

                        db.collection('post').add(saveData).then((result) => {
                            uploadPage.classList.remove('on');
                            next.innerText = 'Next'
                            box1.style.display = "block"
                            box2.style.display = "none"
                            step = 0;
                            window.location.reload();
                        })
                    })
                }
            )
        }
    });

    prev.addEventListener('click',()=> {
        if(step == 1) {
            next.innerText = 'Next'
            box1.style.display = "block"
            box2.style.display = "none"
            step = 0;
        } else if(step == 0) {
            uploadPage.classList.remove('on')
        }
    })

}

input.addEventListener('change',function (e) {
    let file = e.target.files[0];
    image_Url = URL.createObjectURL(file)


    uploadPage.classList.add('on');
    uploadImage1.style.backgroundImage = `url(${image_Url})`
    uploadImage2.style.backgroundImage = `url(${image_Url})`
    btnControll(file);
})





function init() {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let find = x => x.id == currentUser.uid;
    if(currentUser == null) {
        db.collection('post').get().then((result) => {
                result.forEach((doc) => {
                    let time = doc.data().date.toDate();
                    let year = time.getFullYear();
                    let month = time.getMonth()+1;
                    let day = time.getDay();
                    let hours = time.getHours();
                    let min = time.getMinutes();
                    time = `${year}년 ${month}월 ${day}일 ${hours}:${min}`
        
                    let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body" id="${doc.id}"><img src="${doc.data().img}"></div>
                            <div class="post-content">
                                <div class="options">
                                    <p class="likes"><i class="fa fa-heart-o" aria-hidden="true"></i>${doc.data().좋아요수}Likes</p>
                                    <a href="detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
                                </div>
                                <p class="name"><strong>${doc.data().올린사람}</strong>${doc.data().content}</p>
                                <p class="date">${time}</p>
                            </div>           
                        </div> 
                    `
                    $('.container').append(template);
                })
            })
    } else {
        db.collection('post').get().then((result) => {
            result.forEach((doc) => {
                let 좋아요눌린사람 = doc.data().좋아요눌린사람;
                let check = 좋아요눌린사람.findIndex(find)
                if(check == -1) {
                    let time = doc.data().date.toDate();
                    let year = time.getFullYear();
                    let month = time.getMonth()+1;
                    let day = time.getDay();
                    let hours = time.getHours();
                    let min = time.getMinutes();
                    time = `${year}년 ${month}월 ${day}일 ${hours}:${min}`
        
                    let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body" id="${doc.id}"><img src="${doc.data().img}"></div>
                            <div class="post-content">
                                <div class="options">
                                    <p class="likes"><i class="fa fa-heart-o" aria-hidden="true"></i>${doc.data().좋아요수}Likes</p>
                                    <a href="detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
                                </div>
                                <p class="name"><strong>${doc.data().올린사람}</strong>${doc.data().content}</p>
                                <p class="date">${time}</p>
                            </div>           
                        </div> 
                    `
                    $('.container').append(template);
                } else {
                    let time = doc.data().date.toDate();
                    let year = time.getFullYear();
                    let month = time.getMonth()+1;
                    let day = time.getDay();
                    let hours = time.getHours();
                    let min = time.getMinutes();
                    time = `${year}년 ${month}월 ${day}일 ${hours}:${min}`
        
                    let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body" id="${doc.id}"><img src="${doc.data().img}"></div>
                            <div class="post-content">
                                <div class="options">
                                    <p class="likes"><i class="fa fa-heart" aria-hidden="true"></i>${doc.data().좋아요수}Likes</p>
                                    <a href="detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
                                </div>
                                <p class="name"><strong>${doc.data().올린사람}</strong>${doc.data().content}</p>
                                <p class="date">${time}</p>
                            </div>           
                        </div> 
                    `
                    $('.container').append(template);
                }
            })
        })
    }
}

init();



