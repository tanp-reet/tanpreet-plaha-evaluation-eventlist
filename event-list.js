class EventListView {
    constructor() {
        this.addEventBtnElement = document.querySelector(".add-event-btn")
        this.allEventsElement = document.querySelector(".events-list-container")
    }

    displayEvents(events) {
        for(const event of events) {
            this.addEvent(event)
        }
    }

    createEventRow() {
        this.allEventsElement.innerHTML += `
            <tr class="event-details" id="placeholder">
                <td><input type="text" id="event-name-placeholder"></td>
                <td><input type="date" id="event-start-placeholder"></td>
                <td><input type="date" id="event-end-placeholder"></td>
                <td class="buttons-container">
                    <button class="add-btn">
                        +
                    </button>
                    <button class="cancel-btn">
                        X
                    </button>
                </td>
            </tr>
        `
    }

    addEvent(newEvent) {
        this.allEventsElement.innerHTML += `
            <tr class="event-details" id="${newEvent.id}">
                <td><span id="event-name-${newEvent.id}">${newEvent.eventName}</td>
                <td><span id="event-start-${newEvent.id}">${newEvent.startDate}</td>
                <td><span id="event-end-${newEvent.id}">${newEvent.endDate}</td>
                <td class="buttons-container">
                    <button class="edit-btn">
                        E
                    </button>
                    <button class="del-btn">
                        D
                    </button>
                </td>
            </tr>
        `
    }

    editEventOption(eventID) {
        const currEventElement = document.getElementById(eventID)
        const eventNameEle = document.getElementById("event-name-"+eventID)
        const eventName = eventNameEle.textContent
        const startDate = document.getElementById("event-start-"+eventID).innerText
        const endDate = document.getElementById("event-end-"+eventID).innerText
        currEventElement.innerHTML = `
            <tr class="event-details" id="${eventID}">
                <td><input type="text" id="event-name-${eventID}" value="${eventName}"></td>
                <td><input type="date" id="event-start-${eventID}" value="${startDate}"></td>
                <td><input type="date" id="event-end-${eventID}" value="${endDate}"></td>
                <td class="buttons-container">
                    <button class="save-edit-btn">
                        S
                    </button>
                    <button class="cancel-edit-btn">
                        X
                    </button>
                </td>
            </tr>
        `
        // return {eventName, startDate, endDate}
    }

    cancelEditEvent(restoreEvent) {
        const currEventElement = document.getElementById(restoreEvent.id)

        currEventElement.innerHTML = `
            <tr class="event-details" id="${restoreEvent.id}">
                <td><span id="event-name-${restoreEvent.id}">${restoreEvent.eventName}</span></td>
                <td><span id="event-start-${restoreEvent.id}">${restoreEvent.startDate}</span></td>
                <td><span id="event-end-${restoreEvent.id}">${restoreEvent.endDate}</span></td>
                <td class="buttons-container">
                    <button class="edit-btn">
                        E
                    </button>
                    <button class="del-btn">
                        D
                    </button>
                </td>
            </tr>
        `
    }

    updateEvent(eventID, {eventName, startDate, endDate}) {
        const currEventElement = document.getElementById(eventID)

        currEventElement.innerHTML = `
            <tr class="event-details" id="${eventID}">
                <td><span id="event-name-${eventID}">${eventName}</span></td>
                <td><span id="event-start-${eventID}">${startDate}</span></td>
                <td><span id="event-end-${eventID}">${endDate}</span></td>
                <td class="buttons-container">
                    <button class="edit-btn">
                        E
                    </button>
                    <button class="del-btn">
                        D
                    </button>
                </td>
            </tr>
        `
    }

    removeEventRow(eventID) {
        const eventElement = document.getElementById(eventID)
        eventElement.remove()
    }
}

class EventLisModel {
    #listOfEvents = []

    constructor() {
        this.#listOfEvents = []
    }

    addEvent(newEvent) {
        this.#listOfEvents.push(newEvent)
    }

    getSingleEvent(eventID) {
        for(const event of this.#listOfEvents) {
            if(event.id === eventID) {
                return event
            }
        }
    }
    
    updateEvent(eventID, {eventName, startDate, endDate}) {
        for(const event of this.#listOfEvents) {
            if(event.id === eventID) {
                event.eventName = eventName
                event.startDate = startDate
                event.endDate = endDate
                return
            }
        }
    }

    deleteEvent(eventID) {
        this.#listOfEvents.filter((event) => event.id !== eventID)
    }

    getEvents() {
        return this.#listOfEvents
    }

    setEvents(events) {
        this.#listOfEvents = events
    }
}

class EventListController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.init()
    }

    async init() {
        // set up
        const events = await getAllEvents()
        this.model.setEvents(events)
        this.view.displayEvents(events)

        // event handelers
        this.newEventBtnHandler()
        this.cancelAddEventBtnHandler()
        this.addNewEventBtnHandler()
        this.editEventBtnHandler()
        this.cancelEditEventBtnHandler()
        this.saveEditEventBtnHandler()
        this.deleteBtnHandler()
    }

    newEventBtnHandler() {
        this.view.addEventBtnElement.addEventListener("click", () => {
            // check if an input event row already exists
            const rowExists = document.querySelector("#placeholder");
            if (rowExists) {
                return;
            }

            // Add the an empty event row
            this.view.createEventRow()
        })
    }


    cancelAddEventBtnHandler() {
        this.view.allEventsElement.addEventListener("click", (event) => {
            if(event.target.classList.contains("cancel-btn")) {
                this.view.removeEventRow("placeholder")
            }
        })
        
    }

    addNewEventBtnHandler() {
        this.view.allEventsElement.addEventListener("click", async (event) => {
            if(event.target.classList.contains("add-btn")) {
                const eventName = document.querySelector("#event-name-placeholder").value
                const startDate = document.querySelector("#event-start-placeholder").value
                const endDate = document.querySelector("#event-end-placeholder").value

                const eventAdded = await addEvent({eventName: eventName, startDate: startDate, endDate: endDate})
                this.model.addEvent(eventAdded)
                this.view.removeEventRow("placeholder")
                this.view.addEvent(eventAdded)
            }
        })

    }

    editEventBtnHandler() {
        this.view.allEventsElement.addEventListener("click", (event) => {
            if(event.target.classList.contains("edit-btn")) {
                const eventID = event.target.parentElement.parentElement.id
                this.view.editEventOption(eventID)
            }
        })
    }

    cancelEditEventBtnHandler() {
        this.view.allEventsElement.addEventListener("click", (event) => {
            if(event.target.classList.contains("cancel-edit-btn")) {
                const eventID = event.target.parentElement.parentElement.id
                const restoreEvent = this.model.getSingleEvent(eventID)
                this.view.cancelEditEvent(restoreEvent)
            }
        })
    }

    saveEditEventBtnHandler() {
        this.view.allEventsElement.addEventListener("click", async (event) => {
            if(event.target.classList.contains("save-edit-btn")) {
                const eventID = event.target.parentElement.parentElement.id
                const eventName = document.querySelector("#event-name-"+eventID).value
                const startDate = document.querySelector("#event-start-"+eventID).value
                const endDate = document.querySelector("#event-end-"+eventID).value

                await editEvent(eventID, {eventName: eventName, startDate: startDate, endDate: endDate})
                this.model.updateEvent(eventID, {eventName: eventName, startDate: startDate, endDate: endDate})
                this.view.updateEvent(eventID, {eventName: eventName, startDate: startDate, endDate: endDate})
            }
        })
    }

    deleteBtnHandler() {
        this.view.allEventsElement.addEventListener("click", async (event) => {
            if(event.target.classList.contains("del-btn")) {
                const eventID = event.target.parentElement.parentElement.id
                await deleteEvent(eventID)
                this.model.deleteEvent(eventID)
                this.view.removeEventRow(eventID)
            }
        })
    }
}

const eventListView = new EventListView()
const eventLisModel = new EventLisModel()
const eventLisController = new EventListController(eventListView, eventLisModel)
