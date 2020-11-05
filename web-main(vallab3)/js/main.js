const combineList = document.getElementById('combines-list');
const searchBar = document.getElementById('find-combine');
const clearButton = document.getElementById('clear-search-bar');

const createCombineID = document.getElementById('create_id');
const createCombineName = document.getElementById('create_name');
const createCombineSpeed = document.getElementById('create_speedInKm');
const createCombinePrice = document.getElementById('create_priceInUSD');

var editActive = false;

let combines = [{
        "id": 1,
        "name": "Massey 440",
        "speedInKm": 6,
        "priceInUSD": 23000
    },
    {
        "id": 2,
        "name": "John Deere 935",
        "speedInKm": 5,
        "priceInUSD": 423000
    },
    {
        "id": 3,
        "name": "John Deere S670i",
        "speedInKm": 4,
        "priceInUSD": 233000
    },
    {
        "id": 4,
        "name": "Massey 29",
        "speedInKm": 3,
        "priceInUSD": 786000
    },
    {
        "id": 5,
        "name": "Claas Lexion 770",
        "speedInKm": 7,
        "priceInUSD": 999000
    },
    {
        "id": 6,
        "name": "Massey 38",
        "speedInKm": 8,
        "priceInUSD": 912000
    },
    {
        "id": 7,
        "name": "Massey 330",
        "speedInKm": 6,
        "priceInUSD": 123000
    }
]
let currentCombines = combines;

// SEARCH
searchBar.addEventListener('keyup', filterCombines)

function filterCombines(searchString) {
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredCombines = combines.filter(combine => {
        return combine.name.toLowerCase().includes(searchFilterString);
    });
    currentCombines = filteredCombines;
    showSortedCombines();
}

clearButton.addEventListener('click', () => {
    searchBar.value = '';
    currentCombines = combines;
    showSortedCombines();
})

// CALCULATE
function calculatePrice() {
    var priceSum = 0;
    var totalPriceLabel = document.getElementById('total-price');
    currentCombines.forEach(combine => priceSum += combine.priceInUSD);
    totalPriceLabel.textContent = 'Total price: ' + priceSum + '$';
}

//SORT
function showSortedCombines() {
    var sortType = document.getElementById('sort-select').value;
    if (sortType == 'none') {
        displayCombines(currentCombines);
        return;
    } else if (sortType == 'name') {
        currentCombines.sort(compareByName);
    } else if (sortType == 'speed') {
        currentCombines.sort(compareBySpeed);
    } else if (sortType == 'price') {
        currentCombines.sort(compareByPrice);
    }
    displayCombines(currentCombines);
}

function compareByName(firstCombine, secondCombine) {
    var firstCombineName = firstCombine.name.toLowerCase();
    var secondCombineName = secondCombine.name.toLowerCase();
    if (firstCombineName < secondCombineName) {
        return -1;
    }
    if (firstCombineName > secondCombineName) {
        return 1;
    }
    return 0;
}

function compareBySpeed(firstCombine, secondCombine) {
    return firstCombine.speedInKm - secondCombine.speedInKm;
}

function compareByPrice(firstCombine, secondCombine) {
    return firstCombine.priceInUSD - secondCombine.priceInUSD;
}

function deleteRecord(element) {
    console.log(element);
}

const displayCombines = (combinesToShow) => {
    const htmlString = combinesToShow.map((combine) => {
        return `
        <li class="combine">
        <div>            
        <h2 class="combine_id">${combine.id}</h2>
        <h2>${combine.name}</h2>
        <h3 class="speedInKm">${combine.speedInKm} Km</h3>
        <h3 class="priceInUSD">${combine.priceInUSD} $</h3>
    </div>
    <form class="form__edit_combine" id="form__edit_combine">
            <input id="edit_name" name="name" type="text" placeholder="Name">
            <input id="edit_speedInKm" name="speedInKm" type="number" step=1 placeholder="Speed">
            <input id="edit_priceInUSD" name="priceInUSD" type="number" placeholder="Price">
    </form>
            <div class= "control-buttons">
                <button class="btn btn-warning" id="edit-button" onclick="editRecord(this)">Edit</button>
                <button class="btn btn-danger" id="delete-button" onclick="deleteRecord(this)">Delete</button>
            </div>
        </li>
        `
    }).join('');

    combineList.innerHTML = htmlString;
}

function deleteRecord(record) {
    const list_to_delete = record.parentNode.parentNode;
    let combineId = parseInt(list_to_delete.childNodes[1].childNodes[1].innerHTML);
    let indexToDeleteFromAll = combines.findIndex(obj => obj.id == combineId);
    combines.splice(indexToDeleteFromAll, 1);
    if (searchBar.value != '') {
        let indexToDeleteFromCurrent = currentCombines.findIndex(obj => obj.id == combineId);
        console.log(indexToDeleteFromCurrent);
        currentCombines.splice(indexToDeleteFromCurrent, 1);
    }
    showSortedCombines();
    console.log(combines, currentCombines);
    return list_to_delete;
}

function editRecord(record) {
    const nodeList = record.parentNode.parentNode.childNodes;
    const editBar = nodeList[3];
    const infoBar = nodeList[1];
    let combineId = parseInt(infoBar.childNodes[1].innerHTML);
    let combineName = infoBar.childNodes[3].innerHTML;
    let combineSpeed = parseFloat(infoBar.childNodes[5].innerHTML);
    let combinePrice = parseFloat(infoBar.childNodes[7].innerHTML);
    const editedCombineName = nodeList[3][0];
    const editedCombineSpeed = nodeList[3][1];
    const editedCombinePrice = nodeList[3][2];

    let indexToEdit = combines.findIndex(obj => obj.id == combineId);
    if (editActive == false) {
        editBar.classList.add('open');
        editBar.classList.remove('hide');
        infoBar.classList.add('hide');
        infoBar.classList.remove('open');
        editActive = true
    } else if (editActive == true) {
        editBar.classList.add('hide');
        editBar.classList.remove('open');
        infoBar.classList.add('open');
        infoBar.classList.remove('hide');

        if (validateSpeedAndPrice(editedCombineSpeed.value, editedCombinePrice.value) == false) {
            editedCombineSpeed.value = '';
            editedCombinePrice.value = '';
            return;
        }

        if (editedCombineName.value != "") {
            combines[indexToEdit]["name"] = editedCombineName.value;
        } else {
            combines[indexToEdit]["name"] = combineName;
        }
        if (editedCombineSpeed.value != "") {
            combines[indexToEdit]["speedInKm"] = parseFloat(editedCombineSpeed.value);
        } else {
            combines[indexToEdit]["speedInKm"] = combineSpeed;
        }
        if (editedCombinePrice.value != "") {
            combines[indexToEdit]["priceInUSD"] = parseFloat(editedCombinesPrice.value)
        } else {
            combines[indexToEdit]["priceInUSD"] = combinePrice
        }

        editActive = false;
        showSortedCombines();
    }
}

function createCombine() {
    if (validateFormRequirements(createCombineID.value, createCombineName.value, createCombineSpeed.value, createCombinePrice.value) == false) {
        console.log('error');
        return;
    }
    if (validateSpeedAndPrice(createCombineSpeed.value, createCombinePrice.value) == false) {
        console.log('error');
        return;
    }
    let json = createJSON(createCombineID.value, createCombineName.value, createCombineSpeed.value, createCombinePrice.value);

    combines.push(json)

    showSortedCombines();
    return json;
}

function createJSON(id, name, speed, price) {
    let createdCombine = {
        "id": parseInt(id),
        "name": name,
        "speedInKm": parseFloat(speed),
        "priceInUSD": parseFloat(price)
    }
    return createdCombine;

}

function validateSpeedAndPrice(speed, price) {
    if (parseFloat(speed) <= 0) {
        alert('speed cannot be less then zero');
        return false;
    }
    if (parseFloat(price) <= 0) {
        alert('price cannot be less then zero');
        return false;
    }
    return true;
}

function validateFormRequirements(id, name, speed, price) {
    if (id == '') {
        alert('id field is requiered')
        return false;
    }
    if (name == '') {
        alert('name field is requiered')
        return false;
    }
    if (speed == '') {
        alert('speed field is requiered');
        return false;
    }
    if (price == 0) {
        alert('price  field is requiered');
        return false;
    }
    return true;
}

displayCombines(currentCombines)