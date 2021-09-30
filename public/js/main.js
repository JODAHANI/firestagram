const db = firebase.firestore();
const storage = firebase.storage();

let container = document.querySelector('.container');
let inputfile = document.querySelector('.inputfile');
let uploadPage = document.querySelector('.upload-page');
let uploadImage1 = document.querySelector('.upload-image1');
let uploadImage2 = document.querySelector('.upload-image2');
let prevBtn = document.querySelector('.btn.prev')
let nextBtn = document.querySelector('.btn.next');
let box1 = document.querySelector('.box1')
let box2 = document.querySelector('.box2')
let writeBox = document.querySelector('.write-box');

let image_Url;
let pageNum = 0;



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
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
    localStorage.removeItem('user')
    $('.sign-out').removeClass('on');
    $('a.sign').css(`display`, `inline-block`)   
}



db.collection('post').get().then((result) => {
    result.forEach(doc => {
        let date = doc.data().date.toDate();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let time = `${year}년 ${month}월 ${day}일 ${hour}:${min}`;
        let template = `
        <div class="post" style="border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
          <div class="post-header">
            <div class="post-box">
                <div class="profile"></div>
                <div class="profile-name">${doc.data().올린사람}</div>
            </div>
            <div class="detail-page"><a href="/detail.html?id=${doc.id}">...</a></div>
          </div>
          <div class="post-body" style="background-image: url(${doc.data().img})"></div>
          <div class="post-content">
            <div class="options">
              <p class="likes"><i class="fa fa-heart-o" aria-hidden="true"></i>${doc.data().좋아요수} Likes</p>
              <a href="/detail.html?id=${doc.id}"><p class="comment"><i class="fa fa-comment-o" aria-hidden="true"></i>comment</p></a>
            </div>
            <p class="name"><strong>joda_hani</strong>${doc.data().content}</p>
            <p class="date">${time}</p>
          </div>
        </div>
        `
        $('.container').append(template);
    });
});


function btnControll(file) {
    prevBtn.addEventListener('click', function() {
        if(pageNum == 1) {
            nextBtn.innerText = 'Next'
            box1.style.display = "block"
            box2.style.display = "none"
            pageNum = 0;
        } else if(pageNum == 0) {
            uploadPage.classList.remove('on')
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if(pageNum == 0) {
            pageNum ++;
            box1.style.display = "none"
            box2.style.display = "block"
            nextBtn.innerText = 'Sub'
        } else if(pageNum == 1) {
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
                        let saveData = {
                            올린사람: 'joda_hani',
                            좋아요수: 0,
                            content: writeBox.value,
                            date : new Date(),
                            img : url
                
                        }

                        db.collection('post').add(saveData).then((result) => {
                            uploadPage.classList.remove('on');
                            nextBtn.innerText = 'Next'
                            box1.style.display = "block"
                            box2.style.display = "none"
                            pageNum = 0;
                            window.location.reload();
                        })
                    })
                }
            )
        }
    });
}





inputfile.addEventListener('change',function(e) {
    let file = e.target.files[0];
    image_Url = URL.createObjectURL(file)

    btnControll(file)

    uploadPage.classList.add('on')
    uploadImage1.style.backgroundImage = `url('${image_Url}')`;
    uploadImage2.style.backgroundImage = `url('${image_Url}')`;

});




