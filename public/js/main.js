const input = document.querySelector('.inputfile');
const uploadPage = document.querySelector('.upload-page');
const uploadImage1 = document.querySelector('.upload-image1');
const uploadImage2 = document.querySelector('.upload-image2');
const prev = document.querySelector('.btn.prev');
const next = document.querySelector('.btn.next');
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');
const writeBox = document.querySelector('.write-box');

let filter = '';
let step = 0;
let instaFilters = ["_1977", "aden", "brannan", "brooklyn", "clarendon", "earlybird", "gingham", "hudson", "inkwell", "kelvin", "lark", "lofi", "maven", "mayfair", "moon", "nashville", "perpetua", "reyes", "rise", "slumber", "stinson", "toaster", "valencia", "walden", "willow", "xpro2"]

console.log(filter)
function filterControll(image_Url) {
    if (instaFilters.length == 26) {
        $('.filters').empty();
    }
    for (let i = 0; i < instaFilters.length; i++) {
        let template = `
        <div class="filter ${instaFilters[i]}" style="background-image: url(${image_Url})"></div>
        `;
        $('.filters').append(template);
    }
    $('.filter').on('click', function (e) {
        filter = e.target.classList[1]

        if (uploadImage1.classList.length == 2) {
            uploadImage1.classList.remove(uploadImage1.classList[1])
            uploadImage2.classList.remove(uploadImage2.classList[1])
        }
        uploadImage1.classList.add(filter);
        uploadImage2.classList.add(filter);

    })
}


function btnControll(file) {
    next.addEventListener('click', () => {
        if (step == 0) {
            step++;
            box1.style.display = "none"
            box2.style.display = "block"
            next.innerText = 'Sub'
        } else if (step == 1) {
            let storageRef = storage.ref();
            let 저장할경로 = storageRef.child('image/' + file.name);
            let uploadTask = 저장할경로.put(file);
            uploadTask.on('state_changed',
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
                            올린사람id: user.uid,
                            좋아요수: 0,
                            content: writeBox.value,
                            date: new Date(),
                            img: url,
                            댓글: [],
                            좋아요눌린사람: [],
                            필터: filter,
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

    prev.addEventListener('click', () => {
        if (step == 1) {
            next.innerText = 'Next'
            box1.style.display = "block"
            box2.style.display = "none"
            step = 0;
        } else if (step == 0) {
            uploadPage.classList.remove('on')
            filter = ''
            uploadImage1.classList.remove(uploadImage1.classList[1])
            uploadImage2.classList.remove(uploadImage2.classList[1])
        }
    })

}

input.addEventListener('change', function (e) {
    let file = e.target.files[0];
    image_Url = URL.createObjectURL(file)


    uploadPage.classList.add('on');
    uploadImage1.style.backgroundImage = `url(${image_Url})`
    uploadImage2.style.backgroundImage = `url(${image_Url})`

    filterControll(image_Url);
    btnControll(file);
})



function init() {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let find = x => x.id == currentUser.uid;
    if (currentUser == null) {
        db.collection('post').orderBy("date", "desc").get().then((result) => {
            result.forEach((doc) => {
                let time = doc.data().date.toDate();
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let day = time.getDate();
                let hours = time.getHours();
                let min = time.getMinutes();
                let date = `${year}년 ${month}월 ${day < 10 ? `0${day}` : day}일 ${hours < 10 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}`

                let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body ${doc.data().필터}" id="${doc.id}"><img src="${doc.data().img}"></div>
                            <div class="post-content">
                                <div class="options">
                                    <p class="likes"><i class="fa fa-heart-o" aria-hidden="true"></i>${doc.data().좋아요수}Likes</p>
                                    <a href="detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
                                </div>
                                <p class="name"><strong>${doc.data().올린사람}</strong>${doc.data().content}</p>
                                <p class="date">${date}</p>
                            </div>           
                        </div> 
                    `
                $('.container').append(template);
            })
        })
    } else {
        db.collection('post').orderBy("date", "desc").get().then((result) => {
            result.forEach((doc) => {
                let 좋아요눌린사람 = doc.data().좋아요눌린사람;
                let check = 좋아요눌린사람.findIndex(find)
                if (check == -1) {
                    let time = doc.data().date.toDate();
                    let year = time.getFullYear();
                    let month = time.getMonth() + 1;
                    let day = time.getDay();
                    let hours = time.getHours();
                    let min = time.getMinutes();
                    let date = `${year}년 ${month}월 ${day < 10 ? `0${day}` : day}일 ${hours < 10 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}`

                    let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body ${doc.data().필터}" id="${doc.id}"><img src="${doc.data().img}"></div>
                            <div class="post-content">
                                <div class="options">
                                    <p class="likes"><i class="fa fa-heart-o" aria-hidden="true"></i>${doc.data().좋아요수}Likes</p>
                                    <a href="detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
                                </div>
                                <p class="name"><strong>${doc.data().올린사람}</strong>${doc.data().content}</p>
                                <p class="date">${date}</p>
                            </div>           
                        </div> 
                    `
                    $('.container').append(template);
                } else {
                    let time = doc.data().date.toDate();
                    let year = time.getFullYear();
                    let month = time.getMonth() + 1;
                    let day = time.getDate();
                    let hours = time.getHours();
                    let min = time.getMinutes();
                    let date = `${year}년 ${month}월 ${day < 10 ? `0${day}` : day}일 ${hours < 10 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}`

                    let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body ${doc.data().필터}" id="${doc.id}"><img src="${doc.data().img}"></div>
                            <div class="post-content">
                                <div class="options">
                                    <p class="likes"><i class="fa fa-heart" aria-hidden="true"></i>${doc.data().좋아요수}Likes</p>
                                    <a href="detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
                                </div>
                                <p class="name"><strong>${doc.data().올린사람}</strong>${doc.data().content}</p>
                                <p class="date">${date}</p>
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


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        loginData();
    }

});


function loginData() {
    let currentUser = localStorage.getItem('user')
    if (currentUser !== null) {
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
