import myFB from "./fbManager.js";


//---------------------- DATABASE ----------------------//
// CREATE: SETS {field: value} TO "documents/first-document". LEAVE docID BLANK FOR AUTO ID.
myFB.setDoc("documents", {"field": "value"}, "first-document");

// READ: DOCUMENT / COLLECTION
myFB.getDoc("documents", "first-document");
myFB.getCol("documents");


// UPDATE: UPDATES {field: value, field2: +1} TO "documents/first-document"
myFB.updateDoc("documents", {"field": "new-value", "field2": myFB.fieldVal.increment(3)}, "first-document");

// DELETE: DELETES "documents/first-document".
myFB.deleteDoc("documents", "first-document");

// GENERATE DOCUMENT ID
const docID = myFB.genID();



//------------------------ AUTH ------------------------//
// AUTH OBJECT
const auth = myFB.auth;
const user = myFB.getUser();

// LOGIN: RETURNS JSON WITH SUCCESS STATUS, MESSAGE AND USER.
myFB.emailLogin("myemail@domain.com", "coolest-password");
myFB.socialLogin("FACEBOOK");
myFB.socialLogin("GITHUB");

// REGISTER: RETURNS JSON WITH SUCCESS STATUS, MESSAGE AND USER.
myFB.emailRegister("myemail@domain.com", "coolest-password");

// UPDATE EMAIL OR PASSWORD
myFB.updateEmail("myemail@domain.com", "coolest-password", "new-email@domain.com");
myFB.updatePassword("myemail@domain.com", "coolest-password", "new-password");

// LOGOUT
myFB.logout();


//---------------------- STORAGE -----------------------//
// UPLOAD: RETURNS SUCCESS STATUS AND DOWNLOAD URL.
myFB.uploadStorage("path/to/document-name", new Blob());

// DELETE: RETURNS DELETE INSTANCE.
myFB.deleteStorage("path/to/document-name");


//--------------------- FUNCTION -----------------------//
// INSTANCE
const functionInstance = myFB.functions.httpsCallable("func-name");

// CALL
functionInstance({field1: "value"}).then(r=>{
	console.log(r.data);
}).catch(e=>{
	console.log(e.message);
})