document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-event-form');
    const timelineContainer = document.querySelector('#timeline .timeline');

    // array que guarda todos os eventos
    let events = [];

    // função que atualiza a timeline (chamada sempre que um evento é adicionado)
    function renderTimeline() {
        timelineContainer.innerHTML = ''; // limpa a timeline

        // ordenando os eventos: do mais próximo (menor data) para o mais distante (maior data)
        events.sort((a, b) => a.datetime - b.datetime);

        // cria e adiciona cada item do evento no HTML
        events.forEach(event => {
            // formatando a data e a hora para exibição
            const day = String(event.datetime.getDate()).padStart(2, '0');
            const month = String(event.datetime.getMonth() + 1).padStart(2, '0');
            const year = event.datetime.getFullYear();
            const hours = String(event.datetime.getHours()).padStart(2, '0');
            const minutes = String(event.datetime.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year}`;
            const formattedTime = `${hours}:${minutes}`;

            const timelineItem = document.createElement('div');
            timelineItem.classList.add('timeline-item');

            timelineItem.innerHTML = `
                            <div class="content">
                                <div class="date">${formattedDate} - ${formattedTime}</div>
                                <div>${event.name}</div>
                            </div>
                        `;
            timelineContainer.appendChild(timelineItem);
        });
    }

    // evento do formulario para adicionar um novo evento
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const eventName = document.getElementById('event-name').value;
        const eventDate = document.getElementById('event-date').value;
        const eventTime = document.getElementById('event-time').value;

        const newEventDatetime = new Date(`${eventDate}T${eventTime}`);

        events.push({
            name: eventName,
            datetime: newEventDatetime
        });

        renderTimeline(); // atualiza a timeline
        form.reset();
    });

    renderTimeline();
});
