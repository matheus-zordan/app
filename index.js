
// Importa as funções select, input e checkbox do pacote '@inquirer/prompts'
const { select, input, checkbox } = require('@inquirer/prompts')

// Importa o módulo fs do Node.js para manipulação de arquivos, utilizando a versão de promessas
const fs = require("fs").promises

// Declara uma variável mensagem com uma mensagem de boas-vindas
let mensagem = "Bem vindo ao APP de Metas!"
// Declara uma variável metas que será usada para armazenar as metas carregadas do arquivo
let metas

// Função assíncrona para carregar as metas do arquivo 'metas.json'
const carregarMetas = async () => {
    try {
        // Lê o conteúdo do arquivo 'metas.json' e armazena na variável dados
        const dados = await fs.readFile("metas.json", "utf-8")
        // Converte o conteúdo do arquivo de JSON para um objeto JavaScript e armazena em metas
        metas = JSON.parse(dados)
    }
    catch (erro) {
        // Se ocorrer um erro (por exemplo, o arquivo não existir), inicializa metas como um array vazio
        metas = []
    }
}

// Função assíncrona para salvar as metas no arquivo 'metas.json'
const salvarMetas = async () => {
    // Converte o objeto metas para JSON e escreve no arquivo 'metas.json'
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

// Função assíncrona para cadastrar uma nova meta
const cadastrarMeta = async () => {
    // Solicita ao usuário que digite uma meta
    const meta = await input({ message: "Digite a meta:" })

    // Verifica se a meta está vazia
    if (meta.length == 0) {
        // Se estiver vazia, define a mensagem de erro e retorna
        message = 'A meta não pode ser vazia'
        return
    }

    // Adiciona a nova meta ao array metas com o valor digitado e a propriedade checked como false
    metas.push(
        { value: meta, checked: false }
    )

    // Define a mensagem de sucesso
    mensagem = 'Meta cadastrada com sucesso!'
}

// Função assíncrona para listar as metas
const listarMetas = async () => {
    // Verifica se não há metas cadastradas
    if (metas.length == 0) {
        // Se não houver, define a mensagem de erro e retorna
        mensagem = 'Não existem metas!'
        return
    }

    // Solicita ao usuário que selecione as metas usando o prompt checkbox
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar e desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    // Marca todas as metas como não concluídas
    metas.forEach((m) => {
        m.checked = false
    })

    // Verifica se nenhuma meta foi selecionada
    if (respostas.length == 0) {
        // Se nenhuma meta foi selecionada, define a mensagem de erro e retorna
        mensagem = 'Nenhuma meta selecionada'
        return
    }

    // Marca as metas selecionadas como concluídas
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    // Define a mensagem de sucesso
    mensagem = 'Meta(s) marcada(s) como concluídas(s)'
}

// Função assíncrona para listar as metas realizadas
const metasRealizadas = async () => {
    // Verifica se não há metas cadastradas
    if (metas.length == 0) {
        // Se não houver, define a mensagem de erro e retorna
        mensagem = 'Não existem metas!'
        return
    }

    // Filtra as metas que estão marcadas como concluídas
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    // Verifica se nenhuma meta foi realizada
    if (realizadas.length == 0) {
        // Se nenhuma meta foi realizada, define a mensagem de erro e retorna
        message = 'Nenhuma meta foi realizada! :('
        return
    }

    // Exibe as metas realizadas usando o prompt select
    await select({
        message: "Metas Realizadas:",
        choices: [...realizadas]
    })
}

// Função assíncrona para listar as metas abertas
const metasAbertas = async () => {
    // Verifica se não há metas cadastradas
    if (metas.length == 0) {
        // Se não houver, define a mensagem de erro e retorna
        mensagem = "Não existem metas!"
        return
    }

    // Filtra as metas que não estão marcadas como concluídas
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    // Verifica se não há metas abertas
    if (abertas.length == 0) {
        // Se não houver metas abertas, define a mensagem de erro e retorna
        message = 'Não existem metas em aberto! :)'
        return
    }

    // Exibe as metas abertas usando o prompt select
    await select({
        message: "Metas Abertas:" + " " + abertas.length,
        choices: [...abertas]
    })
}

// Função assíncrona para deletar metas
const deletarMetas = async () => {
    // Verifica se não há metas cadastradas
    if (metas.length == 0) {
        // Se não houver, define a mensagem de erro e retorna
        mensagem = "Não existem metas!"
        return
    }

    // Cria uma cópia das metas com a propriedade checked como false
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    // Solicita ao usuário que selecione as metas a serem deletadas usando o prompt checkbox
    const itensADeletar = await checkbox({
        message: 'Selecione o(s) item(s) que deseja deletar',
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    // Verifica se nenhuma meta foi selecionada para deletar
    if (itensADeletar.length == 0) {
        // Se nenhuma meta foi selecionada, define a mensagem de erro e retorna
        message = 'Nenhum item para deletar!'
        return
    }

    // Remove as metas selecionadas do array metas
    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    // Define a mensagem de sucesso
    message = 'Meta(s) removida(s) com sucesso!'
}

// Função para exibir a mensagem atual e limpar a tela do console
const mostarMensagem = () => {
    console.clear()

    // Verifica se há uma mensagem para exibir
    if (mensagem != "") {
        // Exibe a mensagem no console
        console.log(mensagem)
        console.log("")
        // Limpa a mensagem após exibi-la
        mensagem = ""
    }
}

// Função principal que inicia o aplicativo
const start = async () => {
    // Carrega as metas do arquivo
    await carregarMetas()

    // Loop infinito para exibir o menu e processar as opções selecionadas pelo usuário
    while (true) {
        // Exibe a mensagem atual
        mostarMensagem()

        // Solicita ao usuário que selecione uma opção do menu usando o prompt select
        const opcao = await select({
            message: "Menu:",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar Metas",
                    value: "listar"
                },
                {
                    name: "Metas Realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas Abertas",
                    value: "abertas"
                },
                {

                    name: "Deletar Metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até a proxima")
                return
        }
    }
}
start()
