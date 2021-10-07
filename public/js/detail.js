const db = firebase.firestore();
const storage = firebase.storage();

const dm = document.querySelector('.dm')
const likes = document.querySelector('.likes');
const replyBtn = document.querySelector('.reply-btn');
const input = document.querySelector('.reply input')
const uploadPage = document.querySelector('.upload-page');
const next = document.querySelector('.btn.next');
const prev = document.querySelector('.btn.prev');
const writeBox = document.querySelector('.write-box');

let params = new URLSearchParams(window.location.search)

function editReply(e){
    uploadPage.classList.add('on');
    db.collection('post').doc(params.get('id')).get().then((result) => {
        writeBox.innerText = `${result.data().댓글[e.target.id].content}`
        let replyData = result.data().댓글
        next.addEventListener('click', () => {
            replyData[e.target.id].content = writeBox.value
            let edit = {
                댓글 : replyData
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                writeBox.value = ''
                window.location.href = `/detail.html?id=${params.get('id')}`
            })
        });
        prev.addEventListener('click', () => {
            replyData.splice(e.target.id,1);
            let edit = {
                댓글 : replyData
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                window.location.href = `/detail.html?id=${params.get('id')}`
            })
        });
    })
   
}

function reply() {
    db.collection('post').doc(params.get('id')).get().then((result) => {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        let reply = result.data().댓글
        reply.push({id: currentUser.uid, name: currentUser.displayName, content : input.value})
        
        let edit = {
            댓글 : reply    
        }
        db.collection('post').doc(params.get('id')).update(edit).then(()=> {
            input.value = ''
            window.location.href = `/detail.html?id=${params.get('id')}`
        });
    })
}



function likeCheck(likePushUser) {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let find = x => x.id == currentUser.uid;
    let check = likePushUser.findIndex(find);
    if(!(check == -1)) {
        document.querySelector('.fa-heart-o').className = 'fa fa-heart'
    } 
}
db.collection('post').doc(params.get('id')).get().then((result) => {
    document.querySelector('.post-img').innerHTML = `<img src="${result.data().img}">`
    let profile_Name = document.querySelectorAll('.profile-name');
    for(let i = 0; i < profile_Name.length; i++) {
    let item = profile_Name.item(i);
    item.innerHTML = `${result.data().올린사람}`;
    }
    document.querySelector('.post-content').innerHTML = `<span class="profile-name">${result.data().올린사람}:</span> ${result.data().content}`
    document.querySelector('.like .num').innerText = `${result.data().좋아요수}`
    let likePushUser = result.data().좋아요눌린사람
    likeCheck(likePushUser)
    for(let i = 0; i < result.data().댓글.length; i++) {
        let template = `
            <p class="post-reply" id="${i}"><span class="profile-name">${result.data().댓글[i].name}:</span> ${result.data().댓글[i].content}</p>
        `
        $('.post-comments').append(template);
    }
    $('.post-reply').on('dblclick',editReply);
    
});

function editPage() {
    window.location.href = `/edit.html?id=${params.get('id')}`
}

dm.addEventListener('click',()=> {
    window.location.href = '/message.html'
})    



likes.addEventListener('dblclick',()=> {
    db.collection('post').doc(params.get('id')).get().then((result) => {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        let find = x => x.id == currentUser.uid;
        let check = result.data().좋아요눌린사람.findIndex(find);

        if(check == -1) {
            let arr = result.data().좋아요눌린사람;
            arr.push({id: currentUser.uid , name : currentUser.displayName});
            let edit = {
                좋아요눌린사람 : arr,
                좋아요수 : result.data().좋아요수 + 1
            }
            db.collection('post').doc(params.get('id')).update(edit).then(()=> {
                document.querySelector('.like .num').innerText = `${result.data().좋아요수 + 1}`
                document.querySelector('.fa-heart-o').className = 'fa fa-heart'
                alert('좋아요를 눌렀습니다.')
            })
        } else {
            let arr = result.data().좋아요눌린사람;
            arr.splice(check,1);
            let edit = {
                좋아요눌린사람 : arr,
                좋아요수 : result.data().좋아요수 -1
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                document.querySelector('.like .num').innerText = `${result.data().좋아요수 - 1}`
                document.querySelector('.fa-heart').className = 'fa fa-heart-o'
                alert('피드를 좋아하지 않습니다.')
            });
        }

        
        
    })
    
});

replyBtn.addEventListener('click', reply)