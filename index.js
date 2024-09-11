const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao APP de Metas!"
let metas


const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (erro) {
        metas = []
    }

}
const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        message = 'A meta não pode ser vazia'
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = 'Meta cadastrada com sucesso!'

}

const listarMetas = async () => {
    if (metas.length == 0) {
        mensagem = 'Não existem metas!'
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço  para marcar e desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0) {
        mensagem = 'Nenhuma meta selecionada'
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = 'Meta(s) marcada(s) como concluídas(s)'

}

const metasRealizadas = async () => {
    if (metas.length == 0) {
        mensagem = 'Não existem metas!'
        return
    }
    
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        message = 'Nenhuma meta foi realizada! :('
        return
    }

    await select({
        message: "Metas Realizadas:",
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        message = 'Não existem metas em aberto! :)'
        return
    }

    await select({
        message: "Metas Abertas:" + " " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {

    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itensADeletar = await checkbox({
        message: 'Selecione o(s) item(s) que deseja deletar',
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itensADeletar.length == 0) {
        message = 'Nenhum item para deletar!'
        return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    message = 'Meta(s) removida(s) com sucesso!'
}

const mostarMensagem = () => {
    console.clear()

    if (mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {

    await carregarMetas()

    while (true) {
        mostarMensagem()

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