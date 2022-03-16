const dm = document.querySelector('.dm')
const likes = document.querySelector('.likes');
const replyBtn = document.querySelector('.reply-btn');
const input = document.querySelector('.reply input')
const uploadPage = document.querySelector('.upload-page');
const next = document.querySelector('.btn.next');
const prev = document.querySelector('.btn.prev');
const writeBox = document.querySelector('.write-box');
const likeNums = document.querySelector('.like .num')
const likeBox = document.querySelector('.like')
const closeBtn = document.querySelector('.close-btn');
const comment = document.querySelector('.comment')

let currentUser = JSON.parse(localStorage.getItem('user'));

let postUploadUserName;
let postUploadUserId;
let currentUserId = currentUser.uid;
let currentUserName = currentUser.displayName;
let params = new URLSearchParams(window.location.search)
let likeStep = 0;


function editReply(e) {
    uploadPage.classList.add('on');
    db.collection('post').doc(params.get('id')).get().then((result) => {
        writeBox.innerText = `${result.data().댓글[e.target.id].content}`
        let replyData = result.data().댓글
        next.addEventListener('click', () => {
            replyData[e.target.id].content = writeBox.value
            let edit = {
                댓글: replyData
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                writeBox.value = ''
                window.location.href = `/detail.html?id=${params.get('id')}`
            })
        });
        prev.addEventListener('click', () => {
            replyData.splice(e.target.id, 1);
            let edit = {
                댓글: replyData
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                window.location.href = `/detail.html?id=${params.get('id')}`
            })
        });
    })

}

function reply() {
    db.collection('post').doc(params.get('id')).get().then((result) => {
        let reply = result.data().댓글
        reply.push({ id: currentUser.uid, name: currentUser.displayName, content: input.value })

        let edit = {
            댓글: reply
        }
        db.collection('post').doc(params.get('id')).update(edit).then(() => {
            input.value = ''
            window.location.href = `/detail.html?id=${params.get('id')}`
        });
    })
}
function likeCheck(likePushUser) {
    let find = x => x.id == currentUser.uid;
    let check = likePushUser.findIndex(find);
    if (!(check == -1)) {
        let heart = document.querySelector('.fa-heart-o')
        heart.className = 'fa fa-heart'
    }
}
function init() {
    db.collection('post').doc(params.get('id')).get().then((result) => {
        postUploadUserName = result.data().올린사람;
        postUploadUserId = result.data().올린사람id;
        document.querySelector('.post-img').innerHTML = `<img class="${result.data().필터}" src="${result.data().img}">`
        let profile_Name = document.querySelector('.profile-name');
        profile_Name.innerHTML = postUploadUserName
        let postContent = document.querySelector('.post-content')
        let likeNum = document.querySelector('.like .num')

        postContent.innerHTML = `<span class="profile-name">${result.data().올린사람}:</span> ${result.data().content}`
        likeNum.innerText = `${result.data().좋아요수}`

        let likePushUser = result.data().좋아요눌린사람
        likeCheck(likePushUser)
        for (let i = 0; i < result.data().댓글.length; i++) {
            let template = `
                <p class="post-reply" id="${i}"><span class="profile-name">${result.data().댓글[i].name}:</span> ${result.data().댓글[i].content}</p>
            `
            $('.post-comments').append(template);
        }
        $('.post-reply').on('dblclick', editReply);

    });

    likeBox.addEventListener('dblclick', 좋아요누른사람보기)
    closeBtn.addEventListener('click', () => {
        $('.like-page').removeClass('on')
    });
    replyBtn.addEventListener('click', reply)

    // 채팅창
    dm.addEventListener('click', () => {
        let data = {
            participantId: [currentUserId, postUploadUserId],
            participantName: [currentUserName, postUploadUserName],
            date: new Date()
        }
        db.collection('chatroom').add(data).then((result)=> {
            window.location.href = '/message.html'
        });
        // 이거는 채팅js에서 사용하거.
        // db.collection('chatroom').where('participantId', 'array-contains', currentUserId).get().then((result) => {
            // result.forEach((doc) => {
                // let comparison = data.participantId;
                // let arr = doc.data().participantId
                // let arrR = doc.data().participantId.reverse();
                // console.log(JSON.stringify(comparison) == JSON.stringify(arr))
                // console.log(JSON.stringify(comparison) == JSON.stringify(arrR))
            // });
        // })
    })

    // 댓글focus
    comment.addEventListener('click',hover)
}
function hover() {
    document.querySelector('.reply-input').focus()
}

function editPage() {
    window.location.href = `/edit.html?id=${params.get('id')}`
}

likes.addEventListener('dblclick',불러오기);


function 불러오기 () {
    db.collection('post').doc(params.get('id')).get().then((result) => {
        let find = x => x.id == currentUser.uid;
        let check = result.data().좋아요눌린사람.findIndex(find);

        if (check == -1) {
            let arr = result.data().좋아요눌린사람;
            arr.push({ id: currentUser.uid, name: currentUser.displayName });
            let edit = {
                좋아요눌린사람: arr,
                좋아요수: result.data().좋아요수 + 1
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                likeNums.innerText = `${result.data().좋아요수 + 1}`
                let heart = document.querySelector('.fa-heart-o')
                heart.className = 'fa fa-heart'
                alert('좋아요를 눌렀습니다.')
            })
        } else {
            let arr = result.data().좋아요눌린사람;
            arr.splice(check, 1);
            let edit = {
                좋아요눌린사람: arr,
                좋아요수: result.data().좋아요수 - 1
            }
            db.collection('post').doc(params.get('id')).update(edit).then(() => {
                likeNums.innerText = `${result.data().좋아요수 - 1}`
                let heart = document.querySelector('.fa-heart')
                heart.className = 'fa fa-heart-o'
                alert('좋아요 누르기 취소.')
            });
        }



    })
}

function 좋아요누른사람보기() {
    $('.like-page').addClass('on')
    if (likeStep == 0) {
        db.collection('post').doc(params.get('id')).get().then((result) => {
            for (let user of result.data().좋아요눌린사람) {
                let template = `
                    <div class="profile-box">
                        <div class="profile"></div>
                        <div class="profile-name-like">${user.name}</div>
                    </div>
                `
                $('.like-box').append(template)
            }
        });
        likeStep++;
    }
}



init();