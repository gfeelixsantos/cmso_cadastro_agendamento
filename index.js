const express = require('express');
const getSubmissionForm = require('./jotform/jotform')

// funcionario modelo2
const xmlFuncionarioModelo2 = require('./soc/funcionario/xmlModelo2')

// agendamento
const getCompanyCode = require('./soc/agendamento/empresa')
const getEmployeeCode = require('./soc/agendamento/funcionario')
const createXML = require('./soc/agendamento/gerarxml')
const ajustaTipoExame = require('./soc/agendamento/ajustaTipoExame')
const sendSoapSchedule = require('./soc/agendamento/soapAgendamento')

// pedido de exame
const getEmployeeExams = require('./soc/exame/exames')
const examRequestXml = require('./soc/exame/examRequestXml')
const sendSoapExamRequest = require('./soc/exame/soapPedido')

// resultado exames
const getTokenSequential = require('./soc/aso/buscaFicha')
const resultsXML = require('./soc/exame/resultados')
const getSequencialResult = require('./soc/exame/sequencialResultado')

// aso
const getRisks = require('./soc/aso/riscos')
const asoCreateXML = require('./soc/aso/asoXml')
const sendSoapAso = require('./soc/aso/soapAso');
const consultaSetorCargo = require('./soc/agendamento/consultaSetorCargo');

const app = express();
const PORT = process.env.PORT || 3001;
 
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Serviço de webhook online!');
})

app.post('/', async (req, res) => {
    try {
        await dev()
        
    } catch (error) {
        console.error('Erro na execução index.js')
    }
})


async function dev() {
    let agendamento = await getSubmissionForm()

    agendamento = await getCompanyCode(agendamento)
    agendamento = await ajustaTipoExame(agendamento)
    timer()
    agendamento = await consultaSetorCargo(agendamento)
    
    if (agendamento.exame.tipoExame == 'ADMISSIONAL'){
        // Verifica se já não existe cadastro
        agendamento = await getEmployeeCode(agendamento)
        xmlFuncionarioModelo2(agendamento)

        
    }   
    
    // soap agendamento
    let xml = await createXML(agendamento)
    await sendSoapSchedule(xml)
    await timer()

    // soap pedido exame
    agendamento = await getEmployeeExams(agendamento)
    xml = await examRequestXml(agendamento)
    await sendSoapExamRequest(xml)

    await timer()
    
    // soap resultado exames
    agendamento = await getTokenSequential(agendamento)
    agendamento = await getSequencialResult(agendamento)

    for (let index = 0; index < agendamento.exame.listaExames.length; index++) {
        xml = await resultsXML(agendamento, index)
        await sendSoapExamRequest(xml)
        await timer()
    }

    // aso
    agendamento = await getRisks(agendamento)
    xml = await asoCreateXML(agendamento)
    await sendSoapAso(xml)
    await timer()

    console.log(agendamento)

} 

async function timer() {
    return await new Promise((resolve) => setTimeout(resolve, 5000));
}
dev()
app.listen(PORT, () => console.log('Servidor rodando na porta: ', PORT));
 