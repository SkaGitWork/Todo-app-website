var input = document.getElementById("js-new_task")

/* ------------------------------ Add new item ------------------------------ */
input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault()
    insertItem(input.value)
    input.value = ""
  }
})

/* ----------------------------- Insert new item ---------------------------- */
var list = document.getElementById("js-list")
var item_left_elem = document.getElementById("js-item_left")

// Set or get id_counter
var id_counter = 1
if (localStorage.getItem("id_counter") != null) {
  id_counter = parseInt(localStorage.getItem("id_counter"))
}

// Set or get nb_item_left
var nb_item_left = 0
if (localStorage.getItem("nb_item_left") != null) {
  nb_item_left = parseInt(localStorage.getItem("nb_item_left"))
}

function storeDict() {
  localStorage.setItem("dict", JSON.stringify(dict))
}

function insertItem(value) {
  list.innerHTML +=
    '<li class="todo_list--item round" id="item_' +
    id_counter +
    '" draggable="true" ondragstart="drag(event)"  ondrop="drop(event)"><button class="circle-button circle-button--hover" onclick="check(' +
    id_counter +
    ', this)"></button><input id="input_' +
    id_counter +
    '" type="text" value="' +
    value +
    '"><img src="images/icon-cross.svg" class="cross" onclick="delete_item(' +
    id_counter +
    ')"></li>'

  dict[id_counter] = value
  localStorage.setItem("dict", JSON.stringify(dict))
  id_counter++

  nb_item_left++
  item_left_elem.innerHTML = nb_item_left + " Items left"
}

// Get save
var dict = {}
if (localStorage.getItem("dict") != null) {
  var dict = JSON.parse(localStorage.getItem("dict"))

  for (var key in dict) {
    value = dict[key]
    insertItem(value)
  }
}

/* --------------------------------- Delete --------------------------------- */
function delete_item(item_id) {
  var elem = document.getElementById("item_" + item_id)
  elem.parentNode.removeChild(elem)

  item_left_elem.innerHTML = --nb_item_left + " Items left"
  delete dict[item_id]
  localStorage.setItem("dict", JSON.stringify(dict))
}

// Delete from checked list
function delete_from_checked_list(item_id) {
  for (var i = 0; i < checked_id_list.length; i++) {
    if (checked_id_list[i] === item_id) {
      checked_id_list.splice(i, 1)
    }
  }
}

/* ---------------------------------- Check --------------------------------- */
// Set or get checked_id
var checked_id_list = []
if (localStorage.getItem("checked_id") != null) {
  checked_id_list = parseInt(localStorage.getItem("checked_id"))
}

// Check item
function check(item_id, button_ref) {
  var input = document.getElementById("input_" + item_id)
  if (input.style.textDecoration == "line-through") {
    input.style = ""
    input.disabled = false
    button_ref.style = ""
    button_ref.classList.add("circle-button--hover")

    delete_from_checked_list(item_id)
  } else {
    input.disabled = true
    input.style.textDecoration = "line-through"
    input.style.opacity = "0.25"
    button_ref.style.backgroundImage =
      "url('images/icon-check.svg'),linear-gradient(to bottom right,hsl(192, 100%, 67%),hsl(280, 87%, 65%))"
    button_ref.classList.remove("circle-button--hover")

    // Add to checked list
    checked_id_list.push(item_id)
  }
}

/* ---------------------------- Clear completed ---------------------------- */
var clear_completed_elem = document.getElementById("js-clear_completed")
clear_completed_elem.addEventListener("click", function () {
  for (var i = 0; i < checked_id_list.length; i++) {
    delete_item(checked_id_list[i])
    delete_from_checked_list(checked_id_list[i])
    i--
  }
})

var all_btn_elem = document.getElementById("js-all_filter")
var active_btn_elem = document.getElementById("js-active_filter")
var completed_btn_elem = document.getElementById("js-completed_filter")
/* -------------------------------------------------------------------------- */
/*                                   Filter States                                   */
/* -------------------------------------------------------------------------- */

/* --------------------------------- All --------------------------------- */
all_btn_elem.addEventListener("click", function () {
  for (var key in dict) {
    var item_elem = document.getElementById("item_" + key)
    item_elem.style.display = "flex"
  }
})

/* --------------------------------- Active --------------------------------- */
active_btn_elem.addEventListener("click", function () {
  for (var key in dict) {
    var item_elem = document.getElementById("item_" + key)
    item_elem.style.display = "flex"
  }

  for (var i = 0; i < checked_id_list.length; i++) {
    var item_elem = document.getElementById("item_" + checked_id_list[i])
    item_elem.style.display = "none"
  }
})

/* --------------------------------- Completed --------------------------------- */
completed_btn_elem.addEventListener("click", function () {
  // Hide all items
  for (var key in dict) {
    var item_elem = document.getElementById("item_" + key)
    item_elem.style.display = "none"
  }

  // Show checked items
  for (var i = 0; i < checked_id_list.length; i++) {
    var item_elem = document.getElementById("item_" + checked_id_list[i])
    item_elem.style.display = "flex"
  }
})

/* -------------------------------------------------------------------------- */
/*                                Drag and drop                               */
/* -------------------------------------------------------------------------- */
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id)
}

function drop(ev) {
  var target = ev.target.parentNode
  try {
    // Switch between element
    if (target.classList.contains("todo_list--item")) {
      var data = ev.dataTransfer.getData("text")
      var origin = document.getElementById(data)
      var temp_elem = origin

      origin.outerHTML = target.outerHTML
      target.outerHTML = temp_elem.outerHTML


      const firstValue = document.querySelector("#" + data + " input").value // Source
      const secondValue = document.getElementById(ev.target.id).value // Target
      let firstKey
      let secondKey

      // Find keys
      for (var key in dict) {
        if (firstValue == dict[key]) {
          firstKey = key
        }
        if (secondValue == dict[key]) {
          secondKey = key
        }
      }

      // Change dict order
      dict[firstKey] = secondValue
      dict[secondKey] = firstValue

      storeDict()
      onItemInputChange()
    }
  } catch (error) {
    return
  }
}

// Animation
function transition() {
  document.documentElement.classList.add("transition")
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition")
  }, 1000)
}

// Change theme
var theme_switcher = document.getElementById("theme-switcher")
theme_switcher.addEventListener("change", function () {
  document.documentElement.classList.toggle("dark")
  transition()
})

// Enable Item change
function onItemInputChange() {
  var item_input = document.querySelectorAll(".todo_list input")

  for (let i = 0; i < item_input.length; i++) {
    item_input[i].addEventListener("keyup", function (event) {
      event.target.setAttribute("value", event.target.value)

      // Store dict to localStorage
      let event_id = event.target.id
      dict[event_id[event_id.length - 1]] = event.target.value
      storeDict()
    })
  }
}
onItemInputChange()
// var doc = document.getElementById("js-list")
// console.log(doc.childNodes);

// insertItem("Data1")
// insertItem("Data7")
// insertItem("Data144")
// insertItem("Data6")
// insertItem("Dat5")
// insertItem("Data3")
// insertItem("Data2")
