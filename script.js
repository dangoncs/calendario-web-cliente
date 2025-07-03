class Evento {
    constructor(id, nome, datetime) {
        this.id = id;
        this.nome = nome;
        this.datetime = datetime;
    }

    toString() {
        return `Evento: ${this.id}, Nome: ${this.nome}, Data e Hora: ${this.datetime}`;
    }
}

class GerenciadorEventos {
    constructor() {
        this.eventos = []; // array que guarda todos os eventos
    }

    adicionarEvento(nome, dia, hora) {
        const idNovoEvento = this.eventos.length + 1; // id baseado no tamanho do array
        const datetimeNovoEvento = new Date(`${dia}T${hora}`); // salvar como objeto Date
        const novoEvento = new Evento(idNovoEvento, nome, datetimeNovoEvento);

        this.eventos.push(novoEvento);
        this.salvarNoLocalStorage(); // para salvar o novo evento
    }

    removerEvento(id) {
        this.eventos = this.eventos.filter(evento => evento.id !== id);
        this.salvarNoLocalStorage(); // para salvar a remoção
    }

    obterDoLocalStorage() {
        const eventosSalvos = localStorage.getItem("eventos");
        if (eventosSalvos) {
            this.eventos = JSON.parse(eventosSalvos).map(
                (e) => new Evento(e.id, e.nome, new Date(e.datetime))
            );
        }
    }

    salvarNoLocalStorage() {
        localStorage.setItem("eventos", JSON.stringify(this.eventos));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const gerenciador = new GerenciadorEventos();
    gerenciador.obterDoLocalStorage();

    const form = document.getElementById('add-event-form');
    const timelineContainer = document.querySelector('#timeline .timeline');

    // função que atualiza a timeline (chamada sempre que um evento é adicionado)
    function renderTimeline() {
        timelineContainer.innerHTML = ''; // limpa a timeline

        // ordenando os eventos: do mais próximo (menor data) para o mais distante (maior data)
        gerenciador.eventos.sort((a, b) => a.datetime - b.datetime);

        // cria e adiciona cada item do evento no HTML
        gerenciador.eventos.forEach(event => {
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
                                <button class="delete-btn" data-id="${event.id}" title="Remover evento">&times;</button>
                                <div class="date">${formattedDate} - ${formattedTime}</div>
                                <div class="event-name">${event.nome}</div>
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

        //confere a data e hora do evento
        const agora = new Date(); 
        const dataDoEvento = new Date(`${eventDate}T${eventTime}`);

        if (dataDoEvento < agora) {
            alert('Erro: Não é possível adicionar eventos em datas ou horários passados.');
            return; // Interrompe a execução da função se a data for inválida
        }

        gerenciador.adicionarEvento(eventName, eventDate, eventTime);

        renderTimeline(); // atualiza a timeline
        form.reset();
    });

    // clique em um evento da timeline
    timelineContainer.addEventListener('click', function(event) {
        // exclui o evento se o elemento clicado for o botão de deletar
        if (event.target.classList.contains('delete-btn')) {
            const eventId = Number(event.target.getAttribute('data-id'));

            gerenciador.removerEvento(eventId);
            event.target.closest('.timeline-item').remove(); // remover também o item do DOM
        }
    });

    renderTimeline();
});
