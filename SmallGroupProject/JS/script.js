let contact = false;
function move2register(){
    document.getElementById('everything-container').style.transform = "translate(0%)";
}

function move2login(){
    document.getElementById('everything-container').style.transform = "translate(-25%)";
	contact = false;
}

function move2contacts(){
    document.getElementById('everything-container').style.transform = "translate(-50%)";
	contact = true;
	document.getElementById("newName").value = "";
	document.getElementById("newPhone").value = "";
	document.getElementById("newEmail").value = "";
	loadContacts();
}
function move2add(){
    document.getElementById('everything-container').style.transform = "translate(-75%)";
	document.getElementById('form-label').innerHTML = "ADD NEW CONTACT";
	document.getElementById("submit-details").onclick = doAddContact;
	contact = false;
}

function move2edit(){
	contact = false;
    document.getElementById('everything-container').style.transform = "translate(-75%)";
	document.getElementById('form-label').innerHTML = "EDIT CONTACT";

	let contactss = document.getElementById(idSelected);


	console.log(contactss.childNodes[0].innerHTML);
	 let conname = contactss.childNodes[0].innerHTML
	 let conphone = contactss.childNodes[1].innerHTML
	 let conemail = contactss.childNodes[2].innerHTML

	 document.getElementById("submit-details").onclick = doEdit;

	 document.getElementById("newName").value = conname;
	 document.getElementById("newPhone").value = conphone;
	 document.getElementById("newEmail").value = conemail;


}


/*prevents website from refreshing when login is clicked*/

var form = document.getElementById("login");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

var form = document.getElementById("search");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);


var form = document.getElementById("register");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

const urlBase = 'http://cop4331.online/LAMPAPI'/*INSERT DATABASE URL*/;
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let idSelected = 0;

function selectRow(ID){
	idSelected = ID;
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("login-username").value;
	let password = document.getElementById("login-password").value;
	//var hash = md5( password );
	
	
	document.getElementById("login-result").innerHTML = "";

	let tmp = {Login:login,Password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
		
				if( jsonObject.error !== '')
				{		
					document.getElementById("login-result").innerHTML = "THAT USER IS NOT IN THE DATABASE. THE DEMO GODS ARE DISPLEASED...";
					return;
				}
				console.log("ID ===== " + jsonObject.id);
				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				console.log(jsonObject);

				saveCookie();
				document.getElementById("name-display").innerHTML = firstName + " " + lastName;
				document.getElementById("login-result").innerHTML = "";
				login = "";
				password = "";
				move2contacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("login-result").innerHTML = err.message;
	}

}

function hasSpecialChar(field) {
	var regex = /[^a-zA-Z0-9]/;
	return regex.test(field);
  }

  function isValidPhoneNumber(phoneNumber) {
	const regex = /^\d{3}-\d{3}-\d{4}$/;
  	return regex.test(phoneNumber);
  }

  function isValidEmail(email) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return regex.test(email);
  }

function doSignup()
{

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("register-username").value;
	let password = document.getElementById("register-password").value;

	if(hasSpecialChar(login)){
		document.getElementById("register-result").innerHTML = "ERROR: YOU CAN'T HAVE SPECIAL CHARACTERS IN YOUR USERNAME";
		return;
	}
	else if(hasSpecialChar(firstName)){
		document.getElementById("register-result").innerHTML = "ERROR: YOU'RE NOT ELON'S SON, NO SPECIAL CHARACTERS IN FIRST NAMES";
		return;
	}
	else if(hasSpecialChar(lastName)){
		document.getElementById("register-result").innerHTML = "ERROR: YOU CAN'T HAVE SPECIAL CHARACTER IN YOUR LAST NAME";
		return;
	}
	else{
		document.getElementById("register-result").innerHTML = "";
	}


	let tmp = {
        FirstName: firstName,
        LastName: lastName,
        Login: login,
        Password: password
    };



	let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;


	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                return;
            }

            if (this.status == 200) {
				document.getElementById("firstName").value = "";
				document.getElementById("lastName").value = "";
				document.getElementById("register-username").value = "";
				document.getElementById("register-password").value = "";

                
				saveCookie();
				move2login();

            }
        };

        xhr.send(jsonPayload);


		
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }


}



function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(let i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
		move2login();
	}
	else
	{
		document.getElementById("userName").innerHTML = firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.getElementById("allContacts").innerHTML = "";

	move2login();
}



function doAddContact(){
	if(!isValidPhoneNumber(document.getElementById("newPhone").value)){
		document.getElementById("add-result").innerHTML = "ERROR: THAT PHONE NUMBER IS NOT VALID";
		return;
	}
	else if(!isValidEmail(document.getElementById("newEmail").value)){
		console.log(isValidEmail(document.getElementById("newEmail").value));
		document.getElementById("add-result").innerHTML = "ERROR: THAT EMAIL IS NOT VALID";
		return;
	}
	else{
		document.getElementById("add-result").innerHTML = "";
	}

	let newUser = {
		Name: document.getElementById("newName").value,
		Phone: document.getElementById("newPhone").value,
		Email: document.getElementById("newEmail").value,
		UserID: userId
	}

	console.log(newUser);

	let jsonPayload = JSON.stringify(newUser);

    let url = urlBase + '/AddContact.' + extension;


	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
				
				document.getElementById("newName").value = "";
				document.getElementById("newPhone").value = "";
				document.getElementById("newEmail").value = "";
				move2contacts();
            }
        };
		xhr.send(jsonPayload);

	}
	catch(err){
        console.log("err");
	}
	
}


function loadContacts(){
	let tmp = {
        search: "*",
        UserID: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LoadContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
				console.log(jsonObject);
				const contactsDiv = document.getElementById("allContacts");
				console.log(contactsDiv);
				let html = "";
				for(let i = 0; i < jsonObject.results.length; i++){
					html += '<div class="row hover" onClick="selectRow('+ jsonObject.results[i].ID +')" id="' + jsonObject.results[i].ID +'">';
					html += '<div class="text-center user-info col-3" id="'+ jsonObject.results[i].ID + '-name">'+ jsonObject.results[i].name +'</div>';
					html += '<div class="text-center user-info col-3" id="'+ jsonObject.results[i].ID + '-phone">'+ jsonObject.results[i].phone +'</div>';
					html += '<div class="text-center user-info col-3" id="'+ jsonObject.results[i].ID + '-email">'+ jsonObject.results[i].email +'</div> </div>';
				}
				contactsDiv.innerHTML = html;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}



function searchContact(){

	if(document.getElementById("search-value").value === ""){
		loadContacts();
		return;
	}

	let tmp = {
        search: document.getElementById("search-value").value,
        UserID: userId
    };

	console.log("this///")
	console.log(tmp)

    let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


	try{
		xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
				console.log(jsonObject)
				let html = "";
				const contactsDiv = document.getElementById("allContacts");
				for(let i = 0; i < jsonObject.results.length; i++){
					html += '<div class="row hover" onClick="selectRow('+ jsonObject.results[i].ID +')" value="' + jsonObject.results[i].ID +'">';
					html += '<div class="text-center user-info col-3" id="'+ jsonObject.results[i].ID + '-name">'+ jsonObject.results[i].name +'</div>';
					html += '<div class="text-center user-info col-3" id="'+ jsonObject.results[i].ID + '-phone">'+ jsonObject.results[i].phone +'</div>';
					html += '<div class="text-center user-info col-3" id="'+ jsonObject.results[i].ID + '-email">'+ jsonObject.results[i].email +'</div> </div>';
				}
				contactsDiv.innerHTML = html;	
            }
        };
        xhr.send(jsonPayload);
	}
	catch(err){
		console.log(err);
	}
}



let prevNode = null;
window.onclick = e => {
	if(!contact) return
    if(e.target.id && e.target.id !== "demo-gods-logo" && e.target.id !== "userName"){
       
        let pDoc = document.getElementById(e.target.id);
        
        parentDiv = pDoc.parentNode;
        parentDiv.classList.add("selected");

        if(prevNode === parentDiv) return;
        if(prevNode === null){
            prevNode = parentDiv;
        }
        else{
            prevNode.classList.remove("selected");
            prevNode = parentDiv;
        }
    }
} 



function doEdit(){
	if(isValidPhoneNumber(document.getElementById("newPhone").value)){
		document.getElementById("add-result").innerHTML = "ERROR: THAT PHONE NUMBER IS NOT VALID";
		return;
	}
	else if(isValidEmail(document.getElementById("newEmail").value)){
		document.getElementById("add-result").innerHTML = "ERROR: THAT EMAIL IS NOT VALID";
		return;
	}
	else{
		document.getElementById("add-result").innerHTML = "";
	}

	let tmp = {
        Name: document.getElementById("newName").value,
        Phone: document.getElementById("newPhone").value,
		Email: document.getElementById("newEmail").value,
		ID: idSelected

    };

	console.log("this///")
	console.log(tmp)

    let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Edit2.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


	try{
		xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
				move2contacts();
				console.log("edit done")
				console.log(jsonObject);
            }
        };
        xhr.send(jsonPayload);
	}
	catch(err){
		console.log(err);
	}
}



function doDelete(){
	let tmp = {
		ID: idSelected
    };

    let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


	try{
		xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
				loadContacts();
            }
        };
        xhr.send(jsonPayload);
	}
	catch(err){
		console.log(err);
	}
}






/*
Everything commented here is copy and pasted from the reference we were given in class

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}*/
