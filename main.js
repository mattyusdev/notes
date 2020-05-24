let addButton = document.getElementById('addButton');
let resetButton = document.getElementById('resetButton');
let formDesc = document.getElementById('formDesc');
let formDate = document.getElementById('formDate');
let formTime = document.getElementById('formTime');
let clearTime = document.getElementById('clearTime');
let notesBlock = document.getElementById('notesBlock');
let noteFrameClass = document.getElementsByClassName("noteframe");
let noteIndex = 0;
let noteFrame, closeButton, paragraph, noteBottom, span, parsedItems;
let notesIdArray = [];

addButton.addEventListener('click', newNote);
window.addEventListener('load', addLocalstorage);
window.addEventListener('load', timeSet);
window.addEventListener('load', removeNoteAnimation);
clearTime.addEventListener('click', () => formTime.value = '');

function timeSet() {
    let todayDate = new Date();
    formDate.valueAsDate = todayDate;

    let todayHours = todayDate.getHours();
    let todayMinutes = todayDate.getMinutes();

    if (todayMinutes > 30) {
        formTime.value = hoursSet(1) + ':00';
    }

    else {
        formTime.value = hoursSet('') + ':30';
    }

    function hoursSet(num) {
        todayHours = todayHours + num;
        if (todayHours != 24) {
            return ("0" + todayHours).slice(-2);
        }
            return '00';
    }
}

function orderIdNotes() {
    notesIdArray = [];

    for (let i = 0; i < localStorage.length; i++) {
        parsedItems = (JSON.parse(localStorage.getItem(localStorage.key(i))));
        notesIdArray.push(parsedItems.noteindex);
        notesIdArray.sort((a, b) => a - b);
    }
}

function createNotes(id, desc, date, time) {
    removeNoteAnimation();

    noteFrame = document.createElement('div');
    closeButton = document.createElement('i');
    paragraph = document.createElement('p');
    noteBottom = document.createElement('div');
    span = document.createElement('span');
    cornerTriangle = document.createElement('div');

    noteFrame.classList.add('noteframe', 'animation');
    noteFrame.id = id;
    closeButton.classList.add('fa', 'fa-close');
    noteBottom.classList.add('notebottom');
    cornerTriangle.classList.add('note-corner');

    closeButton.addEventListener('click', removeNote);

    notesBlock.appendChild(noteFrame);
    noteFrame.appendChild(closeButton);
    noteFrame.appendChild(paragraph);
    noteFrame.appendChild(noteBottom);
    noteFrame.appendChild(cornerTriangle);

    paragraph.textContent = desc;
    noteBottom.textContent = date;
    span.textContent = time;
    noteBottom.appendChild(span);
}

function removeNoteAnimation() {
    for (let i = 0; i < noteFrameClass.length; i++) {
        noteFrameClass[i].classList.remove('animation');
    }
}

function addLocalstorage() {
    if (localStorage.length != 0) {
        orderIdNotes()

        for (let i = 0; i < localStorage.length; i++) {
            parsedItems = JSON.parse(localStorage.getItem('note' + notesIdArray[i]));

            if (parsedItems.noteindex > noteIndex) {
                noteIndex = parsedItems.noteindex + 1;
            }

            createNotes(parsedItems.id, parsedItems.description, parsedItems.date, parsedItems.time);
        }
    }
}

function newNote() {
    if (formDesc.value != '' && formDesc.value.trim().length != 0 && formDate.value != '') {
        noteIndex++;
        createNotes('note' + noteIndex, formDesc.value, formDate.value, formTime.value);
        localStorage.setItem(noteFrame.id, JSON.stringify({ id: noteFrame.id, noteindex: noteIndex, description: formDesc.value, date: formDate.value, time: formTime.value }));
        formDesc.value = '';
    }

    else {
        alert('Please fill all the required fields (Description, Date)');
    }
}

function removeNote(e) {
    localStorage.removeItem(e.target.parentElement.id);
    e.target.parentElement.remove()
    orderIdNotes();
}
