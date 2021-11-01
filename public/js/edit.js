const writeBox = document.querySelector('.write-box');
const img = document.querySelector('.upload-image');
const delBtn = document.querySelector('.del');
const editBtn = document.querySelector('.edit');


function init() {
    let params = new URLSearchParams(window.location.search);
    db.collection('post').doc(params.get('id')).get().then((result) => {
        console.log(result.data())
        img.style.backgroundImage = `url(${result.data().img})`
        writeBox.value = `${result.data().content}`
    })


    delBtn.addEventListener('click', ()=> {
        db.collection('post').doc(params.get('id')).delete().then((result) => {
            alert('삭제완료 완료!')
            window.location.href = `/`
        })
    })
    editBtn.addEventListener('click', ()=> {
        let edit = {
            content : writeBox.value
        };
        db.collection('post').doc(params.get('id')).update(edit).then((result) => {
            alert('수정 완료!')
            window.location.href = `/detail.html?id=${params.get('id')}`
        })
    })
    
}

init()