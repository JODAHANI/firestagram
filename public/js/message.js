let input = document.querySelector('.chat-input');
let chatBtn = document.querySelector('.chat-btn');

let currentUser = JSON.parse(localStorage.getItem('user'));

let chatroomId;
let currentChatroomId = 0;
function messageLoad(chatroomId) {   
    db.collection('chatroom').doc(chatroomId).collection('messages').orderBy('date','asc').get().then((result)=> {
        result.forEach((doc)=> {
            if(doc.data().uid == currentUser.uid) {
                let template = `
                <li><span class="chat-box mine">${doc.data().content}</span></li>
                `
                $('.chat-content').append(template)
                currentChatroomId = chatroomId;
            } else {
                let template = `
                <li><span class="chat-box">${doc.data().content}</span></li>
                `
                $('.chat-content').append(template)
                currentChatroomId = chatroomId;
            }
            
        })
    })
}

function chatroomClick () {
    $('.list-group-item').on('click', function() {
        chatroomId = $(this).attr('id');
        
        if(currentChatroomId == 0) {
            messageLoad(chatroomId);
        } else if(chatroomId != currentChatroomId) {
            $('.chat-content').empty()
            messageLoad(chatroomId);
        } 
    });
    
}
function init() {
    db.collection('chatroom').where('participantId','array-contains',currentUser.uid).get().then((result)=> {
        result.forEach((doc)=> {
            let a = doc.data().participantName[0]
            let b = doc.data().participantName[1]
            let id = doc.id
            if(a == currentUser.displayName){
                let template = `
                <li class="list-group-item" id="${id}">
                    <h6>${b}</h6>
                <h6 class="text-small">마지막메세지</h6>
                </li>
                `
                $('.chat-list').append(template);    
            } else {
                let template = `
                <li class="list-group-item" id="${id}">
                    <h6>${a}</h6>
                <h6 class="text-small">마지막메세지</h6>
                </li>
                `
                $('.chat-list').append(template);    
            }
        })
        chatroomClick();
    });

    $('.chat-btn').on('click', () => {
        let data = {
            content : input.value,
            date : new Date,
            uid: currentUser.uid
        }
        db.collection('chatroom').doc(chatroomId).collection('messages').add(data).then((result) => {
            let template = `
                <li><span class="chat-box mine">${input.value}</span></li>
            `
            $('.chat-content').append(template)

            input.value = '';
        });
        
    })
}

init()





