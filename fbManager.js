//======================================================//
//														//
//						IMPORT							//
//														//
//======================================================//
const firebase = require('firebase/app');
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
require("firebase/functions");


//======================================================//
//														//
//						INIT							//
//														//
//======================================================//
const firebaseApp = firebase.initializeApp({
})



//----------------------- UTILS ------------------------//
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const functions = firebase.functions();
var fieldVal = firebase.firestore.FieldValue;


//======================================================//
//														//
//						 DATABASE 						//
//														//
//======================================================//
//----------------------- CREATE -----------------------//
function setDoc(path, doc, docID, notiStart, notiDone){
	if (notiStart){
		// cdsNotify.toast(notiStart);
	}
	var currentTime = new Date().getTime();
	var sequence = 1000;
	if (doc.constructor === {}.constructor){
		doc.ID = docID || db.collection(path).doc().id;
		doc["Date Created"] = currentTime;
		doc["Date Updated"] = currentTime;
		doc["cdsSortIndex"] = sequence;	
		return db.collection(path).doc(doc.ID).set(doc).then(() =>{
			// if (notiDone) cdsNotify.toast(notiDone);
		}).catch(err=>{
			// cdsNotify.toast(err.message);
		})
	}
	else if (doc.constructor === [].constructor){
		var batch = db.batch();
		doc.forEach(d=>{
			d.ID = d.ID || db.collection(path).doc().id;
			d["Date Created"] = currentTime;
			d["Date Updated"] = currentTime;
			d["cdsSortIndex"] = sequence;
			sequence++;
			batch.set(db.collection(path).doc(d.ID), d);
		})
		return batch.commit().then(() =>{
			// if (notiDone) cdsNotify.toast(notiDone);
		}).catch(err=>{
			// cdsNotify.toast(err.message);
		})
	}
};
//------------------------ READ ------------------------//
function getDoc(path, docID){
	return db.collection(path).doc(docID);
}
function getCol(path){
	return db.collection(path);
}
//----------------------- UPDATE -----------------------//
function updateDoc(path, doc, docID, notiStart, notiDone){
	if (notiStart){
		// cdsNotify.toast(notiStart);
	}
	var currentTime = new Date().getTime();
	if (doc.constructor === {}.constructor){
		doc["Date Updated"] = currentTime;
		var docID = doc.ID || docID;
		return db.collection(path).doc(docID).update(doc).then((r) =>{
			if (notiDone){
				// cdsNotify.toast(notiDone || "Updating " + docID + " at " + path + " succcessful.");
			}
		}).catch(err=>{
			// cdsNotify.toast(err.message);
		})
	}
	else if (doc.constructor === [].constructor){
		var batch = db.batch();
		doc.forEach(d=>{
			d.ID = d.ID || db.collection(path).doc().id;
			doc["Date Updated"] = currentTime;
			batch.update(db.collection(path).doc(d.ID), d);
		})
		return batch.commit().then(() =>{
			// cdsNotify.toast(notiDone || "Updating " + docID + " at " + path + " was succcessful.");
		}).catch(err=>{
			// cdsNotify.toast(err.message);
		})
	}

};
//----------------------- DELETE -----------------------//
function deleteDoc(path, docID, notiStart, notiDone){
	if (notiStart != undefined){
		// cdsNotify.toast(notiStart);
	}
	if (docID.constructor === [].constructor){
		var batch = db.batch();
		if (path.constructor === [].constructor){

		}
		docID.forEach(d=>{
			batch.delete(db.collection(path).doc(d));
		})
		return batch.commit().then(() =>{
			// cdsNotify.toast(notiDone || "Deletion succcessful.");
		}).catch(err=>{
			// cdsNotify.toast(err.message);
		})
	}
	else if (typeof(docID) === "string"){
		return db.collection(path).doc(docID).delete().then(() =>{
			// cdsNotify.toast(notiDone || "Deleting " + docID + " at " + path + " succcessful.");
		}).catch(err=>{
			// cdsNotify.toast(err.message);
		})
	}
}
//--------------------- ID HANDLING --------------------//
function genID(){
	return db.collection("cdsBruv").doc().id;
}
//======================================================//
//														//
//						 	AUTH 						//
//														//
//======================================================//
//----------------------- EMAIL ------------------------//
async function emailLogin(email, pw){
	return new Promise((resolve, reject)=>{
		auth.signInWithEmailAndPassword(email, pw).then(user => {
			// cdsNotify.toast("logged in")
			return resolve({
				success: true,
				user: user,
				msg: ""
			});
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			});
		})
	})
}
async function emailRegister(email, pw){
	return new Promise((resolve, reject)=>{
		auth.createUserWithEmailAndPassword(email, pw).then(user => {
			// cdsNotify.toast("Registered")
			return resolve({
				success: true,
				user: user,
				msg: ""
			});
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			});
		})
	})
}
async function resetPassword(email){
	return new Promise((resolve, reject)=>{
		auth.sendPasswordResetEmail(email).then(user => {
			// cdsNotify.toast("Password reset email has been sent to your email.");
			return resolve({
				success: true,
				user: user,
				msg: ""
			});
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			});
		})
	})
}
async function updatePassword(email, pw, newPW){
	return new Promise((resolve, reject)=>{
		auth.signInWithEmailAndPassword(email, pw).then(user=>{
			return auth.currentUser.updatePassword(newPW).then(r=> {
				// cdsNotify.toast("Password updated")
				return resolve({
					success: true,
					msg: ""
				})
			}).catch(e =>{
				return resolve({
					success: false,
					user: null,
					msg: e.message
				})
			})
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			})
		})
	})
}
async function updateEmail(email, pw, Email){
	return new Promise((resolve, reject)=>{
		auth.signInWithEmailAndPassword(email, pw).then(user=>{
			return auth.currentUser.updateEmail(Email).then(r=> {
				// cdsNotify.toast("Email updated")
				return resolve({
					success: true,
					msg: ""
				})
			}).catch(e =>{
				return resolve({
					success: false,
					user: null,
					msg: e.message
				})
			})
		}).catch(e =>{
			return resolve({
				success: false,
				user: null,
				msg: e.message
			})
		})
	})
}
//------------------- SOCIAL MEDIA ---------------------//
async function socialLogin(type){
	var type = type.replace(/ /g, "").toUpperCase();
	if (["GOOGLE", "FACEBOOK", "GITHUB"].includes(type)){
		var provider;
		switch(type){
			case "GOOGLE":
				//
				provider = new firebase.auth.GoogleAuthProvider();
				break;
			//
			case "FACEBOOK":
				//
				provider = new firebase.auth.FacebookAuthProvider();
				break;
			//
			case "GITHUB":
				//
				provider = new firebase.auth.GithubAuthProvider();
			//
		}
		return new Promise((resolve, reject)=>{
			auth.signInWithPopup(provider).then(r=>{
				return resolve({
					success: true,
				})
			}).catch(e=>{
				return resolve({
					success: false,
					msg: e.message
				})
			})
		})
	}
	else{
		return {
			success: false,
			msg: "Only google, faceboook or github are supported."
		}
	}
}
//----------------------- USER -------------------------//
function getUser(){
	return auth.currentUser;
}
//---------------------- LOGOUT ------------------------//
function logout(){
	return auth.signOut()
}
//======================================================//
//														//
//						STORAGE 						//
//														//
//======================================================//
//----------------------- UPLOAD -----------------------//
async function uploadStorage(path, file){
	return new Promise((resolve, reject)=>{
		storage.ref(path).put(f).then(async r=>{
			r.ref.getDownloadURL().then(url=>{
				resolve({
					success: true,
					url: url
				})
			}).catch(e=>{
				resolve({
					success: false,
					msg: e.message
				})
			})
		}).catch(e=>{
			resolve({
				success: false,
				msg: e.message
			})
		})
	})
}
//----------------------- DELEETE -----------------------//
async function deleteStorage(path){
	return storage.ref(path).delete();
}


//======================================================//
//														//
//						 EXPORT 						//
//														//
//======================================================//
export default{
	// DATABASE
	db,
	setDoc,
	updateDoc,
	deleteDoc,
	getDoc,
	getCol,
	fieldVal,
	genID,

	// AUTH
	auth,
	getUser: getUser,
	emailLogin,
	emailRegister,
	updatePassword,
	updateEmail,
	resetPassword,
	socialLogin,
	logout,
    authProviders: firebase.auth,

	// STORAGE
	uploadStorage,
	deleteStorage,

	// FUNCTION
	functions
}
