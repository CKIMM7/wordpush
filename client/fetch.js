console.log('fetch.js')
const modal = document.querySelector('#modal');
const form = document.querySelector('form');
const postContent = document.querySelector('#post-content');
const postButton = document.querySelector('#post-button');
const img = document.querySelector('#img');
const formData = new FormData();


let url;
window.location.href.includes('localhost') ? url = 'http://localhost:3000/' : url = 'https://mywordpush.herokuapp.com/'

console.log(url)

postButton.addEventListener("click", function(e) {
    e.preventDefault();

    let data = {
        body: postContent.value,
        comments: [],
        reactionEmoji: [{
            "type": "😀",
            "count": 0
          },
          {
            "type": "😥",
            "count": 0
          },
          {
            "type": "😮",
            "count": 0
          }]
    }

    let imgData = img.files[0]

    formData.append("photo", imgData);
    formData.append("data", JSON.stringify(data));

    sendPost(formData)

  });

  const sendPost = (input) => {

    modal.style.display = "block";
    formContainer.style.display = 'none'

    let obj = {
        method: 'POST',
        headers: { 'Accept': 'application/json',},
        body: input
        }

    return new Promise(async (res, rej) => {

        try {


            const response = await fetch(`${url}posts`, obj);
            const data = await response.json();
            postsGlobal = data
            modal.style.display = "none";
            reLoaded = true
            routes()

            reLoaded = false
            res(data)
        } catch (err) {

            rej(`${err}`)
        }
    })
}
  

const getPosts = () => {

    return new Promise(async (res, rej) => {
        try {
            const response = await fetch(`${url}api`);
            const data = await response.json();
            postsGlobal = data;
            displayPosts()    

            res(data)
        } catch (err) {
            rej(`${err}`)
        }
    })
}


const sendComment = (postId, e) => {

    if(e.code == 'Enter') {
    
    let obj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({postId: postId, body: e.target.value})
        }

    return new Promise(async (res, rej) => {

        try {
            const response = await fetch(`${url}comments`, obj);
            const data = await response.json();

            if(typeof(postId) === 'string') {

            let findPostIndex = data.findIndex((post)=> {
                return post.postId == postId;
            })

            //console.log(findPostIndex)
            let commentToAdd = data[findPostIndex].comments[data[findPostIndex].comments.length - 1]

            //console.log(commentToAdd)

             //new node
             let comment = document.createElement('div');
             let commentTitle = document.createElement('p');
             let commentDate = document.createElement('p');
 
             comment.classList.add('comment');
             commentTitle.textContent = commentToAdd.body;
             commentDate.textContent = commentToAdd.date;
 
             comment.append(commentTitle, commentDate)
 
             //reference node
             let inputList = document.querySelectorAll('.comment-input');
             //console.log(inputList[findPostIndex])
 
             //parent node
             let parentNode = document.querySelectorAll('.comments');
             //console.log(parentNode[findPostIndex])

             parentNode[findPostIndex].insertBefore(comment, inputList[findPostIndex]);

        }   

            if(typeof(postId) === 'number') {

            //console.log(data[postId -1].comments[data[postId -1].comments.length -1])
            let commentToAdd = data[postId -1].comments[data[postId -1].comments.length -1]

            //new node
            let comment = document.createElement('div');
            let commentTitle = document.createElement('p');
            let commentDate = document.createElement('p');

            comment.classList.add('comment');
            commentTitle.textContent = commentToAdd.body;
            commentDate.textContent = commentToAdd.date;

            comment.append(commentTitle, commentDate)
            // commentSection.append(comment)

            //reference node
            let inputList = document.querySelectorAll('.comment-input');
            //console.log(inputList[postId -1])

            //parent node
            let parentNode = document.querySelectorAll('.comments');
            //console.log(parentNode[postId -1])

            parentNode[postId -1].insertBefore(comment, inputList[postId -1]);
            //console.log(parentNode[postId -1])
        }   

            res(data)
        } catch (err) {
            console.log(err)
            rej(`${err}`)
        }
    })
    
    }    
}
   
const incrementEmoji = (type, count, postId) => {

    let emojiIndex = -1
    let input = {
        postId: postId,
        emojiToAdd: type
    }

    let obj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(input)
        }

    return new Promise(async (res, rej) => {

        try {
            const response = await fetch(`${url}emojis`, obj);
            const data = await response.json();

            //update dom for emojis

            let findPostIndex = data.findIndex((post)=> {
                return post.postId == postId;
            })
            
            const emojiToIncrement = data[findPostIndex].reactionEmoji.find((emoji)=> {
                return emoji.type === type;
            })

            //emojiContainer for the right post
            let emojiContainer = document.querySelectorAll('.emojis')[findPostIndex]

            
            //find right emoji inside the right emojiContainer
            let emojiNode =  emojiContainer.childNodes.forEach(n => {
                //console.log(n)  
                if(`'${n.childNodes[0].innerText}'`.includes(`'${type}'`)) {
                    console.log(n.childNodes[1].innerText++)
                }
            })

            res(data)
        } catch (err) {
            console.log(err)
            rej(`${err}`)
        }
    })
    

}




