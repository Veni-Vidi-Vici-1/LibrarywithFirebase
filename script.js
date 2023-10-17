// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase,ref,push,onValue,remove,update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const appSettings = {

databaseURL:"https://library-6d4d3-default-rtdb.europe-west1.firebasedatabase.app/"

}
/*
// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBNZisZO0nM9Gm5sfbEYTstzIChxXtR2r8",
authDomain: "library-6d4d3.firebaseapp.com",
projectId: "library-6d4d3",
storageBucket: "library-6d4d3.appspot.com",
messagingSenderId: "188604304573",
appId: "1:188604304573:web:de2b437a7e9e791dd1bbd4"
};
*/

  // Initialize Firebase
const app = initializeApp(appSettings);
const database = getDatabase(app)
const Library = ref(database, "Library")
const Search = document.getElementById("searchbooks")
Search.addEventListener("input",(e) => UI.searchbook(e))
const Main = document.querySelector("main")
const showborrowerinfo = document.querySelector(".showborrowerinfo")
const AdBookInputs = document.querySelector(".addbook")
const searchbooks = document.getElementById("searchbooks")
const Toggle = document.getElementById("Toggle").addEventListener("click",() => UI.Toggle(Main,AdBookInputs))
const AddBookBtn = document.getElementById("AddBtn").addEventListener("click",() => {



UI.TakeInputValues()
UI.Toggle(Main,AdBookInputs)

})

const Body = document.querySelector("body")

class Book {

constructor(title,author,pagenumber,isInLibray,ISBN,borrowername = undefined,borrowernumber = undefined) {

this.title = title
this.author = author
this.pagenumber = pagenumber
this.isInLibray = isInLibray
this.ISBN = ISBN
this.borrowername = borrowername
this.borrowernumber = borrowernumber

}
}
class UI {

static Toggle(firstelement,secondelement) {
UI.clearFields()
if (firstelement.classList.contains("gridmode")) {

firstelement.classList.remove("gridmode")
firstelement.classList.add("hidden")
secondelement.classList.remove("hidden")
secondelement.classList.add("flexmode")

} else if (firstelement.classList.contains("hidden")) {

firstelement.classList.remove("hidden")
firstelement.classList.add("gridmode")
secondelement.classList.remove("flexmode")
secondelement.classList.add("hidden")

}
var isinlibraryinput = document.getElementById("isinlibrary")
var borrowerinfodiv = document.querySelector(".borrowerinfo")
var AddBook = document.getElementById("Form")

isinlibraryinput.checked = true
borrowerinfodiv.classList.add("hidden")

isinlibraryinput.addEventListener("change",() => {

 if (isinlibraryinput.checked === false) {

borrowerinfodiv.classList.remove("hidden")
AddBook.style.height = "28rem"
borrowerinfodiv.style.height = "7rem"
} else {

borrowerinfodiv.classList.add("hidden")
AddBook.style.height = "24rem"
borrowerinfodiv.style.height = "0px"

}})}

static TakeInputValues() {
Search.value = ""
let title = document.getElementById("title")
let author = document.getElementById("author")
let pagenumber = document.getElementById("pagenumber")
let ISBN = document.getElementById("ISBN")
let isinlibrary = document.getElementById("isinlibrary")
let Nameofborrower = document.getElementById("Nameofborrower")
let Numberofborrower = document.getElementById("Numberofborrower")
  
if (title.value != "" && author.value != "" && pagenumber.value != "" && ISBN.value != "") {

let newBook = new Book(title.value,author.value,pagenumber.value,isinlibrary.checked,ISBN.value, Nameofborrower.value != undefined ? Nameofborrower.value : undefined,Numberofborrower.value != undefined ? Numberofborrower.value : undefined)
push(Library,newBook)

}}

static AddInputValues() {

onValue(Library, function(snapshot) {
if (snapshot.exists()) {

let MyLibrary = Object.entries(snapshot.val())
console.log(MyLibrary)
Main.innerHTML = ""
UI.displayBooks(MyLibrary)

} else {

Main.innerHTML = "No Book in the Library"
Main.style.display = "flex"
}})}

static displayBooks(MyLibrary) {

MyLibrary.forEach((book,index) => {

let title = document.createElement("p")
let author = document.createElement("p")
let pagenumber = document.createElement("p")
let bookwrapper = document.createElement("div")
bookwrapper.classList.add("bookwrapper")
let isinlibrarybtn = document.createElement("button")
let deletebtn = document.createElement("button")
          
bookwrapper.append(title,author,pagenumber,isinlibrarybtn,deletebtn)
title.innerHTML = book[1].title
author.innerHTML = book[1].author
pagenumber.innerHTML = book[1].pagenumber
isinlibrarybtn.innerHTML = book[1].isInLibray ? "Kütüphanede" : "Ödünç Alındı"
!book[1].isInLibray ? isinlibrarybtn.addEventListener("click",() => UI.showBorrowerInfo(book[1],book[0])) : 
isinlibrarybtn.addEventListener("click",() => UI.borrowbook(book[0]))
deletebtn.innerHTML = "Delete"
deletebtn.addEventListener("click",() => UI.deleteBook(book[0]))
Main.appendChild(bookwrapper)
Main.style.display = "grid"
        
})

}

static deleteBook(bookkey) {

let bookinDB = ref(database,`Library/${bookkey}`,)
remove(bookinDB)
console.log(bookinDB)
Search.value = ""
UI.showMessage("Kitap silindi")
  
}

static clearFields() {

let title = document.getElementById("title")
let author = document.getElementById("author")
let pagenumber = document.getElementById("pagenumber")
let ISBN = document.getElementById("ISBN")
let isinlibrary = document.getElementById("isinlibrary")
let Nameofborrower = document.getElementById("Nameofborrower")
let Numberofborrower = document.getElementById("Numberofborrower")

title.value = ""
author.value = ""
pagenumber.value = ""
ISBN.value = ""
isinlibrary.checked = false
Nameofborrower = ""
Numberofborrower = ""
Search.value = ""

}

static borrowbook(bookkey) {
console.log(bookkey)
Search.value = ""
document.getElementById("Toggle").disabled = true
let Nameofborrower2 = document.getElementById("Nameofborrower2")
let Numberofborrower2 = document.getElementById("Numberofborrower2")

const borrowbook = document.querySelector(".borrowbook")

if (borrowbook.classList.contains("hidden")) {

borrowbook.classList.remove("hidden")
borrowbook.style.width = "16rem"
borrowbook.style.height = "16rem"
Main.classList.remove("gridmode")
Main.classList.add("hidden")

}

const giveup = document.getElementById("giveup")

giveup.addEventListener("click",() => {

UI.ToggleMainandBB(borrowbook)
document.getElementById("Toggle").disabled = false

})

const Borrow = document.getElementById("Borrow")
Borrow.addEventListener("click",() => {

if (Nameofborrower2.value != "" && Numberofborrower2.value != "") {

let updates = {

isInLibray : false,
borrowername : Nameofborrower2.value,
borrowernumber: Numberofborrower2.value

}

let bookinDB = ref(database,`Library/${bookkey}`)

update(bookinDB,updates)
UI.ToggleMainandBB(borrowbook)
UI.showMessage("Kitap ödünç verildi")
Nameofborrower2.value = ""
Numberofborrower2.value = ""
document.getElementById("Toggle").disabled = false
location.reload()
}

})

}

static showBorrowerInfo(bookinfo,bookkey) {
Search.value = ""
document.getElementById("Toggle").disabled = true
const name = document.querySelector(".name")
const number = document.querySelector(".number")

name.innerHTML = bookinfo.borrowername
number.innerHTML = bookinfo.borrowernumber

if (showborrowerinfo.classList.contains("hidden")) {

UI.Toggle(Main,showborrowerinfo)
showborrowerinfo.style.width = "16rem"
showborrowerinfo.style.height = "16rem"

}

const CloseTab = document.getElementById("CloseTab").addEventListener("click",() => UI.ToggleMainandSB()
)

const RetrieveBook = document.getElementById("retrievebook").addEventListener("click",() => UI.RetrieveBook(bookkey))
}

static ToggleMainandSB() {
  document.getElementById("Toggle").disabled = false

  if (showborrowerinfo.classList.contains("flexmode")) {

    showborrowerinfo.classList.remove("flexmode")
    showborrowerinfo.classList.add("hidden")
    Main.classList.remove("hidden")
    Main.classList.add("gridmode")
    
    }
    
    showborrowerinfo.style.width = "0rem"
    showborrowerinfo.style.height = "0rem"

}

static ToggleMainandBB(borrowbook) {

  borrowbook.classList.add("hidden")
  borrowbook.style.width = "0rem"
  borrowbook.style.height = "0rem"
  
  Main.classList.remove("hidden")
  Main.classList.add("gridmode")

}

static RetrieveBook(bookkey) {

Search.value = ""
let updates = {

isInLibray : true,
borrowername : "",
borrowernumber : ""

}

let bookinDB = ref(database,`Library/${bookkey}`)

console.log(bookinDB)

update(bookinDB,updates)

UI.ToggleMainandSB()
UI.showMessage("Kitap geri alındı")

}

static searchbook(e) {

onValue(Library,function(snapshot) {

if (snapshot.exists()) {

let MyLibrary = Object.entries(snapshot.val())
Main.innerHTML = ""
const value = e.target.value.toLowerCase()
const filteredBooks = MyLibrary.filter( book => {
return book[1].title.toLowerCase().includes(value) || book[1].author.toLowerCase().includes(value)

})

console.log(filteredBooks)
UI.displayBooks(filteredBooks)

}

})

}

static showMessage(text) {

let infoDiv = document.createElement("div")
let infop = document.createElement("p")
infop.innerHTML = text
infoDiv.appendChild(infop)
infoDiv.classList.add("message")
Body.appendChild(infoDiv)
setTimeout(() => {infoDiv.classList.add("hidden")},1500)

}

}

document.addEventListener("DOMContentLoaded",() => {

UI.AddInputValues()
})