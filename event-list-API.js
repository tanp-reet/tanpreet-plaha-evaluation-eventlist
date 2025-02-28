const EVENTS_API = "http://localhost:3000/events"

// GET
async function getAllEvents() {
    const response = await fetch(EVENTS_API)
    const allEvents = await response.json()
    return allEvents
}

// POST
async function addEvent(newEvent) {
    const response = await fetch(EVENTS_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent)
    })
    const eventAdded = await response.json()
    return eventAdded
}

// PUT
async function editEvent(eventID, updatedEvent) {
    const eventEndpoint = EVENTS_API + "/" + eventID
    await fetch(eventEndpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedEvent)
    })
}

// DELETE
async function deleteEvent(eventID) {
    const eventEndpoint = EVENTS_API + "/" + eventID
    await fetch(eventEndpoint, {
        method: "DELETE"
    })
}