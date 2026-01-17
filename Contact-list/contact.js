let contactform = document.getElementById("contact-form");
let selectedconname = contactform.elements["name"];
let selectedconnumber = contactform.elements["Contact-Number"];
let error1 = document.getElementById("pargarph1");
let error2 = document.getElementById("pargarph2");
let btn = document.querySelector("#savebtn");
let ulref = document.querySelector("ul");
let sortval = document.querySelector("#sorting");
let inputField = document.querySelector("#name");
let contactNumberField = document.querySelector("#Contact-Number");
let searchdiv = document.querySelector("#search-div");
let isAdd = true;
let count = 0;
let contacts = [];
let updateid;

function createDomList(arr) {
  ulref.innerHTML = " ";
  arr.forEach((data) => {
    let liElement = document.createElement("li");
    liElement.innerHTML = ` <span class="names">${data.contactName}</span>
     <span>${data.prefix + " " + data.contactNumber}</span>
    <button id=${data.id} class="updatebtn"> update </button>
    <button id=${data.id} class="deletebtn"> Delete </button>
    `;
    ulref.append(liElement);
  });
}

searchdiv.addEventListener("click", (e) => {
  if (e.target.id === "searchbtn") {
    let val = searchdiv.children[0].value;
    let filteredlist = contacts.filter((data) => {
      return data.contactName.includes(val);
    });
    createDomList(filteredlist);
  }
});

sortval.addEventListener("change", (e) => {
  e.preventDefault();
  console.log(e.target.value);
  // if (e.target.value === "ASC") {
  //   let listw = contacts.toSorted((a, b) => {
  //     return a.contactName.localeCompare(b.contactName);
  //   });
  //   createDomList(listw);
  // } else if (e.target.value === "DESC") {
  //   let listw = contacts.toSorted((a, b) => {
  //     return b.contactName.localeCompare(a.contactName);
  //   });
  //   createDomList(listw);
  // } else {
  //   createDomList(contacts);
  // }

  if(e.target.value === "ASC" || e.target.value === "DESC") {
     let listw = contacts.toSorted((a, b) => {
      return e.target.value === "ASC" ?  a.contactName.localeCompare(b.contactName) : b.contactName.localeCompare(a.contactName);
    });
    createDomList(listw);

  } else {
    createDomList(contacts);

  }
});

function addValidationError (elementName,errorMessage, errorsList = []) {
  if(elementName && errorMessage ) {
    errorsList.push({
      name:elementName,
      message:errorMessage
    })
  }
}
function clearElementInnerText(id) {

  if(!id){
    console.error("Element Id is required")
    return;
  }
  document.getElementById(id).innerText = " ";
}

contactform.addEventListener("submit", (event) => {
  event.preventDefault();
  let validationErrors = [];

  let conname = selectedconname.value;
  let connumber = selectedconnumber.value;
  let prefix = contactform.elements["prefix"].value;

  if (!conname.trim()) {
    // validationErrors.push({
    //   name: "pargarph1",
    //   message: "Please Enter valid name!",
    // });
    addValidationError(
      "pargarph1",
      "Please Enter valid name!",
      validationErrors,
    );
  } else {
    clearElementInnerText("pargarph1");
  }

  if (connumber.length !== 10) {
    // validationErrors.push({
    //   name: "pargarph2",
    //   message: "Please Enter valid number!",
    // });
    addValidationError(
      "pargarph2",
      "Please Enter valid number!",
      validationErrors,
    );
  } else {
    clearElementInnerText("pargarph2");
  }


  if (validationErrors.length > 0) {
    validationErrors.forEach((errorobj) => {
      console.log(errorobj.name);
      let err = document.getElementById(errorobj.name);
      err.innerText = errorobj.message;
      err.style.color = "red";
    });
    return;
  }

  if (isAdd) {
    contacts = [
      ...contacts,
      {
        id: Date.now(),
        contactName: conname,
        contactNumber: connumber,
        prefix: prefix,
      },
    ];
    // createDomList(contacts);
  } else {
    let updatedList;
    let check = contacts.some((data) => {
      return data.id === updateid;
    });

    if (!check) {
      contacts = [
        ...contacts,
        {
          id: Date.now(),
          contactName: conname,
          contactNumber: connumber,
          prefix: prefix,
        },
      ];
    } else {
      updatedList = contacts.map((item) => {
        return item.id === updateid
          ? {
              ...item,
              contactName: conname,
              contactNumber: connumber,
              prefix: prefix,
            }
          : item;
      });
      contacts = [...updatedList];
    }

    isAdd = true;
    btn.innerText = !isAdd ? "Update" : "Add";
  }

  createDomList(contacts);

  selectedconname.value = "";
  selectedconnumber.value = "";
});

inputField.addEventListener("input", (e) => {
  let conname = selectedconname.value;

  if (!conname.trim()) {
    let err = document.getElementById("pargarph1");
    err.innerText = "Please Enter valid name!";
    err.style.color = "red";
  } else {
    clearElementInnerText("pargarph1");
  }
});

contactNumberField.addEventListener("input", (e) => {
  let connumber = selectedconnumber.value;
  if (connumber.length !== 10) {
    let err = document.getElementById("pargarph2");
    err.innerText = "Please Enter valid number!";
    err.style.color = "red";
  } else {
    clearElementInnerText("pargarph2");
  }
});

ulref.addEventListener("click", (e) => {
  let oldvallist = e.target.parentElement.querySelectorAll("span");
  if (e.target.className === "updatebtn") {
    isAdd = false;
    btn.innerText = !isAdd ? "Update" : "Add";
    selectedconname.value = oldvallist[0].innerText;
    selectedconnumber.value = parseInt(oldvallist[1].innerText.slice(3));
    updateid = Number(e.target.id)
  }

  if (e.target.className === "deletebtn") {
    let id = Number(e.target.id);
    let deletedData = contacts.filter((data) => {
      return data.id !== id;
    });
    contacts = [...deletedData]
    createDomList(contacts);
    //  isAdd = true;
    // btn.innerText = !isAdd ? "Update" : "Add";
  }
});
