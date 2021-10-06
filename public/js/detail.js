const db = firebase.firestore();
const storage = firebase.storage();

const dm = document.querySelector('.dm')
const likes = document.querySelector('.likes');

let params = new URLSearchParams(window.location.search)


function 좋아요체크(좋아요눌린사람) {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    let find = x => x.id == currentUser.uid;
    let check = 좋아요눌린사람.findIndex(find);
    console.log(check)
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
    let 좋아요눌린사람 = result.data().좋아요눌린사람
    좋아요체크(좋아요눌린사람)
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