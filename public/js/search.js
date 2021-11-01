const form = document.querySelector('.form');
const formInput = document.querySelector('.form-control');

let params = new URLSearchParams(window.location.search);

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let search = formInput.value
    window.location.href = `/search.html?search=${search}`
})

function init() {
    let search = params.get('search');

    db.collection('post').orderBy("date", "desc").get().then((reuslt) => {
        reuslt.forEach((doc) => {
            let word = doc.data().content;
            let regex = new RegExp(search);
            if (regex.test(word)) {
                let time = doc.data().date.toDate();
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let day = time.getDate();
                let hours = time.getHours();
                let min = time.getMinutes();
                let date = `${year}년 ${month}월 ${day < 10 ? `0${day}` : day}일 ${hours < 10 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}`
                let currentUser = JSON.parse(localStorage.getItem('user'));
                let find = x => x.id == currentUser.uid;
                let 좋아요눌린사람 = doc.data().좋아요눌린사람;
                let check = 좋아요눌린사람.findIndex(find)
                if (check == -1) {
                    let template = `
                        <div class="post">
                            <div class="post-header">
                                <div class="profile-box">
                                    <div class="profile"></div>
                                    <div class="profile-name">${doc.data().올린사람}</div>
                                </div>
                                <div class="detail"><a href="/detail.html?id=${doc.id}">...</a></div>
                            </div>
                            <div class="post-body" id="${doc.id}"><img class="${doc.data().필터}" src="${doc.data().img}"></div>
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

            }

        })
    })
}

init()