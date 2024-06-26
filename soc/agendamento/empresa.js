async function getCompanyCode(agendamento) {

    try {
        const url = `https://ws1.soc.com.br/WebSoc/exportadados?parametro={"empresa":'16459',"codigo":"161676","chave":"664aeac783745a3d5679","tipoSaida":"json"}`;
    
        const response = await fetch(url);
        const responseBuff = await response.arrayBuffer();
        const empresas = new TextDecoder('iso-8859-1').decode(responseBuff);
        const arrEmpresas = JSON.parse(empresas);
        
        const empresasAtivas = arrEmpresas.filter( emp => emp['ATIVO'] == '1')
        const empresaAgendada = empresasAtivas.find( emp => emp['CNPJ'] == agendamento.cnpj)
        agendamento.codEmpresa = empresaAgendada['CODIGO']
        
        return agendamento

    } catch (error) {
        console.error('Erro ao buscar código empresa (fn: getCompanyCode)', error);
    }
}

module.exports = getCompanyCode