async function getCompanyCode(agendamento) {

    try {
        const url = `https://ws1.soc.com.br/WebSoc/exportadados?parametro={"empresa":'16459',"codigo":"161676","chave":"664aeac783745a3d5679","tipoSaida":"json"}`;
    
        const response = await fetch(url);
        const responseBuff = await response.arrayBuffer();
        const empresas = new TextDecoder('iso-8859-1').decode(responseBuff);
        const arrEmpresas = JSON.parse(empresas);
        
        const dadosEmpresa = arrEmpresas.filter( emp => emp['ATIVO'] == '1' && emp['CNPJ'] == agendamento.empresa.cnpj)
        agendamento.empresa.codEmpresa = dadosEmpresa[0]['CODIGO']
        agendamento.empresa.razaoSocial = dadosEmpresa[0]['RAZAOSOCIAL']
        
        return agendamento

    } catch (error) {
        console.error('Erro ao buscar código empresa (fn: getCompanyCode)', error);
    }
}

module.exports = getCompanyCode

/*[
  {
    CODIGO: '1796818',
    NOMEABREVIADO: 'FRANCISCO OLIVEIRA DE ANDRADE SERVIÇOS DE ENGENHARIA',
    RAZAOSOCIALINICIAL: 'FRANCISCO OLIVEIRA DE ANDRADE SERVIÇOS DE ENGENHARIA',
    RAZAOSOCIAL: 'FRANCISCO OLIVEIRA DE ANDRADE SERVIÇOS DE ENGENHARIA',
    ENDERECO: 'Rua 4 JB',
    NUMEROENDERECO: '8',
    COMPLEMENTOENDERECO: '',
    BAIRRO: 'Jardim Bandeirantes',
    CIDADE: 'Rio Claro',
    CEP: '13503-673',
    UF: 'SP',
    CNPJ: '45.651.756/0001-39',
    INSCRICAOESTADUAL: '',
    INSCRICAOMUNICIPAL: '',
    ATIVO: '1',
    CODIGOCLIENTEINTEGRACAO: '',
    'CÓD. CLIENTE (INT.)': ''
  }
]*/