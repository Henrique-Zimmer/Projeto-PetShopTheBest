/*
    Funções usadas nas páginas do PetShop The Best.
    O código trabalha com data e hora, formulário, resumo do agendamento,
    validações simples e alteração de conteúdo no documento.
*/

document.addEventListener("DOMContentLoaded", function () {
    atualizarDataHora();
    setInterval(atualizarDataHora, 1000);

    prepararFormularioAgendamento();
});

function atualizarDataHora() {
    const elementosDataHora = document.querySelectorAll(".data-hora-atual");
    if (elementosDataHora.length === 0) {
        return;
    }

    const agora = new Date();
    const texto = agora.toLocaleDateString("pt-BR") + " - " + agora.toLocaleTimeString("pt-BR");

    for (let i = 0; i < elementosDataHora.length; i++) {
        elementosDataHora[i].innerHTML = texto;
    }
}

function prepararFormularioAgendamento() {
    const form = document.getElementById("formCadastroAgendamento");
    if (!form) {
        return;
    }

    const campoData = document.getElementById("dataAgendamento");
    const camposQueAlteramResumo = document.querySelectorAll(
        "#servico, input[name='metodoAgendamento'], input[name='portePet']"
    );

    if (campoData) {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(8, 0, 0, 0);
        campoData.min = formatarDataHoraLocal(amanha);
    }

    for (let i = 0; i < camposQueAlteramResumo.length; i++) {
        camposQueAlteramResumo[i].addEventListener("change", atualizarResumoAgendamento);
    }

    atualizarResumoAgendamento();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const validacao = validarAgendamento();
        if (!validacao.valido) {
            mostrarMensagem(validacao.mensagem, "danger");
            return;
        }

        const nomeCliente = document.getElementById("nomeCliente").value;
        const nomePet = document.getElementById("nomePet").value;
        const servico = document.getElementById("servico");
        const metodo = document.querySelector("input[name='metodoAgendamento']:checked");
        const data = new Date(document.getElementById("dataAgendamento").value);
        const valor = calcularValorEstimado();

        const texto =
            "<strong>Solicitação de agendamento registrada com sucesso!</strong><br>" +
            "Cliente: " + nomeCliente + "<br>" +
            "Pet: " + nomePet + "<br>" +
            "Serviço: " + servico.options[servico.selectedIndex].text + "<br>" +
            "Método: " + metodo.value + "<br>" +
            "Data e horário: " + data.toLocaleString("pt-BR") + "<br>" +
            "Valor estimado: R$ " + valor.toFixed(2).replace(".", ",");

        mostrarMensagem(texto, "success");
    });

    form.addEventListener("reset", function () {
        setTimeout(function () {
            atualizarResumoAgendamento();
            document.getElementById("mensagemAgendamento").innerHTML = "";
        }, 100);
    });
}

function formatarDataHoraLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");

    return ano + "-" + mes + "-" + dia + "T" + hora + ":" + minuto;
}

function calcularValorEstimado() {
    const servico = document.getElementById("servico");
    const metodo = document.querySelector("input[name='metodoAgendamento']:checked");
    const porte = document.querySelector("input[name='portePet']:checked");

    let valor = 0;

    if (servico && servico.value === "Banho") {
        valor = 49.90;
    } else if (servico && servico.value === "Tosa") {
        valor = 59.90;
    }

    if (porte && porte.value === "Médio") {
        valor += 10;
    } else if (porte && porte.value === "Grande") {
        valor += 20;
    }

    if (metodo && metodo.value === "Tele-busca") {
        valor += 25;
    }

    return valor;
}

function atualizarResumoAgendamento() {
    const resumo = document.getElementById("resumoAgendamento");
    const saidaValor = document.getElementById("valorEstimado");

    if (!resumo || !saidaValor) {
        return;
    }

    const servico = document.getElementById("servico");
    const metodo = document.querySelector("input[name='metodoAgendamento']:checked");
    const porte = document.querySelector("input[name='portePet']:checked");
    const valor = calcularValorEstimado();

    const nomeServico = servico && servico.value !== "" ? servico.value : "não selecionado";
    const nomeMetodo = metodo ? metodo.value : "não selecionado";
    const nomePorte = porte ? porte.value : "não selecionado";

    saidaValor.value = "R$ " + valor.toFixed(2).replace(".", ",");

    resumo.innerHTML =
        "Serviço: " + nomeServico +
        " | Método: " + nomeMetodo +
        " | Porte: " + nomePorte +
        " | Estimativa: R$ " + valor.toFixed(2).replace(".", ",");
}

function validarAgendamento() {
    const campoData = document.getElementById("dataAgendamento");

    if (!campoData || campoData.value === "") {
        return {
            valido: false,
            mensagem: "Informe a data e o horário do agendamento."
        };
    }

    const data = new Date(campoData.value);
    const diaSemana = data.getDay();
    const hora = data.getHours();

    if (diaSemana === 0) {
        return {
            valido: false,
            mensagem: "Escolha um horário de segunda a sábado. O petshop não atende aos domingos."
        };
    }

    if (hora < 8 || hora >= 18) {
        return {
            valido: false,
            mensagem: "Escolha um horário entre 08h e 18h."
        };
    }

    return {
        valido: true,
        mensagem: "Agendamento válido."
    };
}

function mostrarMensagem(texto, tipo) {
    const areaMensagem = document.getElementById("mensagemAgendamento");
    if (!areaMensagem) {
        return;
    }

    areaMensagem.className = "alert alert-" + tipo;
    areaMensagem.innerHTML = texto;
}
