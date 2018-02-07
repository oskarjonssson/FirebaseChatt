
window.addEventListener('load', function(event){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDzz9eKc2zMXWYIgsTEB4b-qLmZQFeLeLc",
        authDomain: "labration1-f2c76.firebaseapp.com",
        databaseURL: "https://labration1-f2c76.firebaseio.com",
        projectId: "labration1-f2c76",
        storageBucket: "labration1-f2c76.appspot.com",
        messagingSenderId: "55032294574"
    };
  firebase.initializeApp(config);
  const db = firebase.database();

  function updateScroll() {
          let ele = document.getElementById("containerMessage");
          ele.scrollTop= ele.scrollHeight;
  }

/**SEND MESSAGE TO DATABASE***/
  let addBtn = document.getElementById("btnSend"); // Add message button


  function sendMessage(){
    let inputMessage = document.getElementById("inputMessage").value; // Input
    let timeFix = function(){
        var currentTime = new Date(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes();
        var timeSent = hours + ":" + minutes;
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
        return hours + ":" + minutes;
      }
    let dataNamn = localStorage.getItem("data");
    let namnMessage = JSON.parse(dataNamn);

    var pushedRef = firebase.database().ref('/').push({'message' : inputMessage, 'time': timeFix() , 'namn' : namnMessage.namn, 'likes' :{} , 'dislikes' : {}});
    var pushedKey = pushedRef.key;

    document.getElementById("inputMessage").value = "";
  };

  addBtn.addEventListener('click', sendMessage);




/*** LISTENS AND ADDS NEW MESSAGES***/

  var startListening = function() {
    db.ref('/').on('child_added', function(snapshot , prevChildKey) {
      var msg = snapshot.val();
      var key = snapshot.key;

      let messageCon = document.getElementById("containerMessage");

      const newDiv = document.createElement("div");
      const newMessage = document.createElement("p");
      const newTime = document.createElement("p");
      const newNamn = document.createElement("p");
      const newLikeBtn = document.createElement("button");
      const newLike = document.createElement("p");
      const newDisLikeBtn = document.createElement("button");
      const newDisLike = document.createElement("p");


      newDisLikeBtn.innerHTML = "DISLIKE";
      newLikeBtn.innerHTML = "LIKE";
      newNamn.innerHTML = msg.namn;
      newTime.innerHTML =  msg.time;
      newMessage.innerHTML = msg.message;
      newDisLikeBtn.className = "btnLikes";
      newLikeBtn.className = "btnLikes";
      newDisLike.className = "likesMessage";
      newLike.className = "likesMessage";
      newDiv.className = "message";
      newNamn.className = "namnMessage";
      newMessage.className = "textMessage";
      newTime.className = "tidMessage";

      messageCon.appendChild(newDiv);
      newDiv.appendChild(newNamn);
      newDiv.appendChild(newMessage);
      newDiv.appendChild(newTime);
      newDiv.appendChild(newLikeBtn);
      newDiv.appendChild(newLike);
      newDiv.appendChild(newDisLikeBtn);
      newDiv.appendChild(newDisLike);

      /**GLOBALA**/
      var globalLike;
      var globalWholiked;
      /**UPDATE LIKES***/
      db.ref().child('/' + key + '/likes/').on('value', function(snapshot) {
        let changed = snapshot.val();
        let keyy = snapshot.key;
        for(let x in changed){
          globalLike = changed[x].likes;
          let likedAdd = changed[x].likes;
          globalWholiked = changed[x].whoLiked;
          newLike.innerHTML = likedAdd;
          }
       });

       /**GLOBALA**/
       var globalDislike;
       var whoDisliked;
       /**UPDATE DISLIKES***/
       db.ref().child('/' + key + '/dislikes/').on('value', function(snapshot) {
         let changed = snapshot.val();
         let keyy = snapshot.key;
         for(let x in changed){
           globalDislike = changed[x].dislikes;
           let likedSub = changed[x].dislikes;
           whoDisliked = changed[x].whoDisliked
           newDisLike.innerHTML = likedSub;
         }
        });

        /** GET NAMN OUT OF LOCAL STORAGE**/
        let namn = localStorage.getItem("data");
        let dataParse = JSON.parse(namn);
        /** LIKE BUTTON - ONE LIKE TO DATABASE- ONLY ONE LIKE PER USER**/
        newLikeBtn.addEventListener('click', function(event){
          if(dataParse.namn == globalWholiked){
            //newLikeBtn.style.visibility = "hidden";
            console.log("User " + dataParse.namn + " has already liked this message");
          }else{
            if( globalLike === undefined){                  //ERROR HANDLING - IF THERE IS NO LIKE VALUE IN THE DATABASE THEN THE FIRST LIKE GETS VALUE OF ONE 1
              firebase.database().ref('/' + key + '/likes').push({'likes' : 1, 'whoLiked' : dataParse.namn});
            }else{
              var count = globalLike += 1;                  //LAST LIKE VALUE FROM DATABASE + 1
              firebase.database().ref('/' + key + '/likes').push({'likes' : count, 'whoLiked' : dataParse.namn});
            }
          }
        });

        /** DISLIKE BUTTON - ONE DISLIKE TO DATABASE- ONLY ONE DISLIKE PER USER**/
        newDisLikeBtn.addEventListener('click', function(event){
            if(dataParse.namn == whoDisliked){
              console.log("User " + dataParse.namn + " has already disliked this message");
            }else{
              if( globalDislike === undefined){                 //ERROR HANDLING - IF THERE IS NO DISLIKE VALUE IN THE DATABASE THEN THE FIRST DISLIKE GETS VALUE OF ONE 1
                firebase.database().ref('/' + key + '/dislikes').push({'dislikes' : 1, 'whoDisliked' : dataParse.namn});
              }else{
                var count = globalDislike += 1;               //LAST DISLIKE VALUE FROM DATABASE + 1
                firebase.database().ref('/' + key + '/dislikes').push({'dislikes' : count, 'whoDisliked' : dataParse.namn});
              }
            }
        });
      updateScroll();           //KEEPS THE SCROLL AT THE BOTTOM
      });
    }

    // LISTENS AFTER CHANGES
    startListening();



/**** STORE USERNAME ****/
let storeBtn = document.getElementById("btnContent");

let namnFun = function() {
  let login = document.getElementById("login");
  let namnInput = document.getElementById("inputContent");
  const data = {namn: inputContent.value}
  let dataString = JSON.stringify( data );
  window.localStorage.setItem('data', dataString);
  let myDataString = localStorage.getItem("data");
  let dataParse = JSON.parse(myDataString);
  let popup = document.getElementById("popup");
  popup.style.display = "none";
  login.innerHTML = "USER : " + namnInput.value;
}


storeBtn.addEventListener('click', namnFun);

let sparaNamn = function(){
  let popup = document.getElementById("popup");
  let namn = localStorage.getItem("data");
  let dataParse = JSON.parse(namn);
  if(namn == null){
    popup.style.display = "block";
  }else{
    popup.style.display = "none";
    login.innerHTML = "USER : " + dataParse.namn;
  }
};

sparaNamn();
/**** LOGOUT ***/
let logutBtn = document.getElementById("logut");
let logut = function(){
  localStorage.removeItem('data');
  login.innerHTML = "";
  let popup = document.getElementById("popup");
  popup.style.display = "block";
  document.getElementById("inputContent").value = "";
};
logutBtn.addEventListener('click', logut);



/*******/
    });
