const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: "tomar 3L de agua por dia",
    checked: false,
}

let metas = [
    meta
]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        console.log('A meta não pode ser vazia')
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço  para marcar e desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0) {
        console.log('nenhuma meta selecionada')
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log('Meta(s) marcada(s) como concluídas(s)')

}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        console.log('Nenhuma meta foi realizada! :(')
        return
    }

    await select({
        message: "Metas Realizadas:",
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter(() => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        console.log('Não existem metas em aberto! :)')
        return
    }

    await select({
        message: "Metas Abertas:" + " " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checkbox: false }
    })

    const itensADeletar = await checkbox({
        message: 'Selecione o(s) item(s) que deseja deletar',
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itensADeletar.length == 0) {
        console.log('Nenhum item para deletar!')
        return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    console.log('Meta(s) removida(s) com sucesso!')
}

const start = async () => {

    while (true) {

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
                console.log(metas)
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