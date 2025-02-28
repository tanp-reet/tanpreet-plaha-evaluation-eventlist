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
            <div class="event-details" id="placeholder">
                <input type="text" id="event-name-placeholder">
                <input type="date" id="event-start-placeholder">
                <input type="date" id="event-end-placeholder">
                <div class="buttons-container">
                    <button class="add-btn">
                        +
                    </button>
                    <button class="cancel-btn">
                        X
                    </button>
                </div>
            </div>
        `
    }

    addEvent(newEvent) {
        this.allEventsElement.innerHTML += `
            <div class="event-details" id="${newEvent.id}">
                <span id="event-name-${newEvent.id}">${newEvent.eventName}</span>
                <span id="event-start-${newEvent.id}">${newEvent.startDate}</span>
                <span id="event-end-${newEvent.id}">${newEvent.endDate}</span>
                <div class="buttons-container">
                    <button class="edit-btn">
                        E
                    </button>
                    <button class="del-btn">
                        D
                    </button>
                </div>
            </div>
        `
    }

    editEventOption(eventID) {
        const currEventElement = document.getElementById(eventID)
        const eventName = document.getElementById("event-name-"+eventID).textContent
        const startDate = document.getElementById("event-start-"+eventID).innerText
        const endDate = document.getElementById("event-end-"+eventID).innerText
        currEventElement.innerHTML = `
            <div class="event-details" id="${eventID}">
                <input type="text" id="event-name-${eventID}" value="${eventName}">
                <input type="date" id="event-start-${eventID}" value="${startDate}">
                <input type="date" id="event-end-${eventID}" value="${endDate}">
                <div class="buttons-container">
                    <button class="save-edit-btn">
                        S
                    </button>
                    <button class="cancel-edit-btn">
                        X
                    </button>
                </div>
            </div>
        `
        return {eventName, startDate, endDate}
    }

    cancelEditEvent(restoreEvent) {
        const currEventElement = document.getElementById(restoreEvent.id)

        currEventElement.innerHTML = `
            <div class="event-details" id="${restoreEvent.id}">
                <span id="event-name-${restoreEvent.id}">${restoreEvent.eventName}</span>
                <span id="event-start-${restoreEvent.id}">${restoreEvent.startDate}</span>
                <span id="event-end-${restoreEvent.id}">${restoreEvent.endDate}</span>
                <div class="buttons-container">
                    <button class="edit-btn">
                        E
                    </button>
                    <button class="del-btn">
                        D
                    </button>
                </div>
            </div>
        `
    }

    updateEvent(eventID, {eventName, startDate, endDate}) {
        const currEventElement = document.getElementById(eventID)

        currEventElement.innerHTML = `
            <div class="event-details" id="${eventID.id}">
                <span id="event-name-${eventID.id}">${eventName}</span>
                <span id="event-start-${eventID.id}">${startDate}</span>
                <span id="event-end-${eventID.id}">${endDate}</span>
                <div class="buttons-container">
                    <button class="edit-btn">
                        E
                    </button>
                    <button class="del-btn">
                        D
                    </button>
                </div>
            </div>
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
