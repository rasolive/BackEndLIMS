const request = require('supertest')
const API_v1 = "http://localhost:8089/v1"
const API = "http://localhost:8089"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6Im5vbWUiLCJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInJvbGUiOlsiViJdLCJ2YWxpZFBhc3MiOnRydWUsImlhdCI6MTY3NTUxMzU3MywiZXhwIjoxNjc1NTMxNTczfQ.alCdEZy4dhPU2IhxvqyltfoLHqm1u6F6W67RkRC0aU4"
const token_invalido = "skljndfsdlfn"

describe("Health", () => {
    it("verificar se aplicação está no ar", async () => {

        const response = await request(API).get('/health')

        expectedResponse = { "healthy": true }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(200)

    })

})

describe("Autenticação", () => {
    it("deve ser possivel criar usuário", async () => {

        email = 'email@email.com'

        const response = await request(API_v1).post('/auth/createUser')
            .send({
                "email": email,
                "name": "nome",
                "password": "senha",
                "validPass": true
            })
            .set('Content-Type', 'application/json')

        expect(response.body.message.email).toBe(email)
        expect(response.status).toBe(200)

    })
    it("Deve falhar ao criar usuário já existente", async () => {

        const response = await request(API_v1).post('/auth/createUser')
            .send({
                "email": email,
                "name": "nome",
                "password": "senha",
                "validPass": true
            })
            .set('Content-Type', 'application/json')

        expectedResponse = {
            "error": "User already exists"
        }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(412)

    })

    it("deve altenticar o usuário", async () => {

        const response = await request(API_v1).post('/auth/authenticate')
            .send({
                "email": email,
                "password": "senha",
            })
            .set('Content-Type', 'application/json')

        expect(response.status).toBe(200)
        const token = response.body.token

    })

    it("deve falhar ao autenticar, usuário não encontrado", async () => {

        const response = await request(API_v1).post('/auth/authenticate')
            .send({
                "email": `${email}.net`,
                "password": "senha",
            })
            .set('Content-Type', 'application/json')

        expectedResponse = {
            "error": "User not foud"
        }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(400)
        const token = response.body.token

    })

    it("deve falhar ao autenticar, Senha incorreta", async () => {

        const response = await request(API_v1).post('/auth/authenticate')
            .send({
                "email": email,
                "password": "SENHA",
            })
            .set('Content-Type', 'application/json')

        expectedResponse = {
            "error": "invalid password"
        }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)
        const token = response.body.token

    })

})

describe("Fornecedores", () => {
    it("deve falhar ao utilizar token inválido", async () => {

        const response = await request(API_v1).post('/fornecedores')
            .send({
                "bairro": "bairro",
                "cep": "00000-000",
                "cidade": "cidade",
                "cnpj": "00.000.000/0000-03",
                "email": "email@email.com",
                "estado": "SP",
                "name": "nome do fornecedor",
                "numero": 1,
                "rua": "rua",
                "telefone": "(99) 9 9999-9999"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })
    it("deve ser possivel Cadastrar Fornecedor", async () => {

        cnpj = "00.000.000/0000-01"

        const response = await request(API_v1).post('/fornecedores')
            .send({
                "bairro": "bairro",
                "cep": "00000-000",
                "cidade": "cidade",
                "cnpj": cnpj,
                "email": "email@email.com",
                "estado": "SP",
                "name": "nome do fornecedor",
                "numero": 1,
                "rua": "rua",
                "telefone": "(99) 9 9999-9999"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.cnpj).toBe(cnpj)
        expect(response.status).toBe(200)

    })

    it("deve falhar ao criar fornecedor existente", async () => {

        const response = await request(API_v1).post('/fornecedores')
            .send({
                "bairro": "bairro",
                "cep": "00000-000",
                "cidade": "cidade",
                "cnpj": cnpj,
                "email": "email@email.com",
                "estado": "SP",
                "name": "nome do fornecedor",
                "numero": 1,
                "rua": "rua",
                "telefone": "(99) 9 9999-9999"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expectedResponse = { error: 'Supplier already exists' }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(412)
        console.log(response.body)

    })

    it("deve listar fornecedores existentes", async () => {

        const response = await request(API_v1).get('/fornecedores')
            .set('Authorization', token)

        expectedResponse = [
            {
                _id: 1,
                active: true,
                name: 'nome do fornecedor',
                rua: 'rua',
                numero: '1',
                bairro: 'bairro',
                cidade: 'cidade',
                estado: 'SP',
                cep: '00000-000',
                telefone: '(99) 9 9999-9999',
                email: 'email@email.com',
                cnpj: '00.000.000/0000-01',
                createdBy: 'email@email.com',
                 __v: 0
            }
        ]
        expect(response.body).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("deve listar fornecedores especifio", async () => {

        const response = await request(API_v1).get('/fornecedores/1')
            .set('Authorization', token)

        expectedResponse = 
            {
                _id: 1,
                active: true,
                name: 'nome do fornecedor',
                rua: 'rua',
                numero: '1',
                bairro: 'bairro',
                cidade: 'cidade',
                estado: 'SP',
                cep: '00000-000',
                telefone: '(99) 9 9999-9999',
                email: 'email@email.com',
                cnpj: '00.000.000/0000-01',
                createdBy: 'email@email.com',
                __v: 0
            }
        
        expect(response.body).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)
        console.log(response.body)

    })

    it("deve ser possivel Alterar Cadastro do fornecedor sem alterar CNPJ", async () => {

        cnpj = "00.000.000/0000-01"
        const name = "novo nome do fornecedor"

        const response = await request(API_v1).put('/fornecedores/1')            
            .send({
                "name": "novo nome do fornecedor",
                "cnpj": "00.000.000/0000-02"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.cnpj).toBe(cnpj)
        expect(response.body.message.name).toBe(name)
        expect(response.status).toBe(200)

    })
})









//     "put": {
//         "summary": "Cadastro de Fornecedores",
//         "description": "Essa rota realiza o cadstro de Fornecedores",
//         "tags": [
//             "Fornecedores"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do fornecedor",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/fornecedores"
//                     },
//                     "examples": {
//                         "Criar Forneecedor": {
//                             "value": {
//                                 "bairro": "bairro",
//                                 "cep": "00000-000",
//                                 "cidade": "cidade",
//                                 "email": "email@email.com",
//                                 "estado": "SP",
//                                 "name": "nome do fornecedor",
//                                 "numero": 1,
//                                 "rua": "rua",
//                                 "telefone": "(99) 9 9999-9999"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar fornecedor por \"id\"",
//         "description": "Essa rota deleta um fornecedor especifico",
//         "tags": [
//             "Fornecedores"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do fornecedor",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/materiais": {
//     "post": {
//         "summary": "Cadastro de Materiais",
//         "description": "Essa rota realiza o cadastro de Materiais",
//         "tags": [
//             "Materiais"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/materiais"
//                     },
//                     "examples": {
//                         "Criar Material": {
//                             "value": {
//                                 "armazenamento": "A",
//                                 "fornecedor": [
//                                     1,
//                                     11
//                                 ],
//                                 "name": "material x",
//                                 "statusMaterial": "L",
//                                 "umb": "G"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Matrial Cadastrado com sucesso"
//             }
//         }
//     },
//     "get": {
//         "summary": "Lista de materiais cadastrados",
//         "description": "Essa rota realiza a busca de materiais cadastrados no banco",
//         "tags": [
//             "Materiais"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/materiais/{_id}": {
//     "get": {
//         "summary": "Busca de material por \"id\"",
//         "description": "Essa rota realiza a busca de material especifico",
//         "tags": [
//             "Materiais"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do material",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Cadastro de Materiais",
//         "description": "Essa rota realiza o atualização de Materiais",
//         "tags": [
//             "Materiais"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do material",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/materiais"
//                     },
//                     "examples": {
//                         "Criar Material": {
//                             "value": {
//                                 "name": "material y"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar material por \"id\"",
//         "description": "Essa rota deleta um material especifico",
//         "tags": [
//             "Materiais"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do material",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/lotes": {
//     "post": {
//         "summary": "Cadastro de Lotes",
//         "description": "Essa rota realiza o cadastro de Lotes",
//         "tags": [
//             "Lotes"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/lotes"
//                     },
//                     "examples": {
//                         "Criar Lote": {
//                             "value": {
//                                 "fornecedor": "1",
//                                 "loteFornecedor": "xyz",
//                                 "material": "1",
//                                 "qtdInicial": 1000,
//                                 "statusLote": "Q",
//                                 "validade": "2023-03-24"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Lote Cadastrado com sucesso"
//             }
//         }
//     },
//     "get": {
//         "summary": "Lista de lotes cadastrados",
//         "description": "Essa rota realiza a busca de lotes cadastrados no banco",
//         "tags": [
//             "Lotes"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/lotes/{_id}": {
//     "get": {
//         "summary": "Busca de lote por \"id\"",
//         "description": "Essa rota realiza a busca de lote especifico",
//         "tags": [
//             "Lotes"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do lote",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Atualização de Lotes/resultados de analises",
//         "description": "Essa rota realiza atualização de dados de Lotes e inserção de resultados de analises",
//         "tags": [
//             "Lotes"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do lote",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/lotes"
//                     },
//                     "examples": {
//                         "Atualizar Lote": {
//                             "value": {
//                                 "qtdInicial": 2000
//                             }
//                         },
//                         "Inserir resultados": {
//                             "value": {
//                                 "_id": 16,
//                                 "active": true,
//                                 "material": 2,
//                                 "fornecedor": 2,
//                                 "lote": "LM1000016",
//                                 "loteFornecedor": "4535345",
//                                 "qtdInicial": 5,
//                                 "validade": "2023-03-15",
//                                 "statusLote": "L",
//                                 "analysisResult": [
//                                     {
//                                         "_id": 1,
//                                         "active": true,
//                                         "AnalysisType": "Qualitativa",
//                                         "name": "cor",
//                                         "AnalysisMethod": "MA-0002",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:12.674Z",
//                                         "updatedAt": "2022-06-28T23:06:07.520Z",
//                                         "id": 1,
//                                         "__v": 0,
//                                         "updatedBy": "rasolive@gmail.com",
//                                         "result": "A",
//                                         "status": true
//                                     },
//                                     {
//                                         "_id": 3,
//                                         "active": true,
//                                         "name": "Aparência",
//                                         "AnalysisMethod": "MA-0005",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:42.624Z",
//                                         "updatedAt": "2022-06-28T21:15:32.587Z",
//                                         "id": 3,
//                                         "__v": 0,
//                                         "AnalysisType": "Qualitativa",
//                                         "updatedBy": "rasolive@gmail.com",
//                                         "result": "A",
//                                         "status": true
//                                     },
//                                     {
//                                         "_id": 4,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "pH",
//                                         "AnalysisMethod": "MA-0001",
//                                         "unit": "ph",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:53.334Z",
//                                         "updatedAt": "2022-06-28T21:14:53.334Z",
//                                         "id": 4,
//                                         "__v": 0,
//                                         "min": "4",
//                                         "max": "5",
//                                         "result": "4.5",
//                                         "status": true
//                                     },
//                                     {
//                                         "_id": 6,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "Densidade",
//                                         "AnalysisMethod": "MA-1008",
//                                         "unit": "g/ml",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:15:25.128Z",
//                                         "updatedAt": "2022-07-01T17:51:58.096Z",
//                                         "id": 6,
//                                         "__v": 0,
//                                         "updatedBy": "rasolive@gmail.com",
//                                         "min": "0.98",
//                                         "max": "1.02",
//                                         "result": "1",
//                                         "status": true
//                                     },
//                                     {
//                                         "_id": 5,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "Viscosidade",
//                                         "AnalysisMethod": "MA-0003",
//                                         "unit": "cp",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:15:10.323Z",
//                                         "updatedAt": "2022-06-28T21:15:10.323Z",
//                                         "id": 5,
//                                         "__v": 0,
//                                         "min": "1000",
//                                         "max": "2000",
//                                         "result": "1500",
//                                         "status": true
//                                     }
//                                 ],
//                                 "startedAnalysis": true,
//                                 "createdBy": "rasolive@gmail.com",
//                                 "createdAt": {
//                                     "$date": "2023-01-31T14:55:19.346Z"
//                                 },
//                                 "updatedAt": {
//                                     "$date": "2023-02-03T15:12:29.967Z"
//                                 },
//                                 "__v": 0,
//                                 "updatedBy": "rasolive@gmail.com"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar lote por \"id\"",
//         "description": "Essa rota deleta um lote especifico",
//         "tags": [
//             "Lotes"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do lote",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/lotes?statusLote=L": {
//     "get": {
//         "summary": "Busca de lote aprovados",
//         "description": "Essa rota realiza a busca de lotes aprovados",
//         "tags": [
//             "Lotes"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/lotes?statusLote=R": {
//     "get": {
//         "summary": "Busca de lote reprovados",
//         "description": "Essa rota realiza a busca de lotes reprovados",
//         "tags": [
//             "Lotes"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/lotes?vencidos=T": {
//     "get": {
//         "summary": "Busca de lote vencidos",
//         "description": "Essa rota realiza a busca de lotes vencidos",
//         "tags": [
//             "Lotes"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/lotes?statusLote=Q": {
//     "get": {
//         "summary": "Lista de lotes em qualidade",
//         "description": "Essa rota realiza a busca de lotes em qualidade no banco",
//         "tags": [
//             "Lotes"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/analysisMethod": {
//     "post": {
//         "summary": "Cadastro de Métodos de Analises",
//         "description": "Essa rota realiza o cadastro de Métodos de Analises",
//         "tags": [
//             "Métodos de Analises"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/analysisMethod"
//                     },
//                     "examples": {
//                         "Criar Método": {
//                             "value": {
//                                 "description": "nome da análise",
//                                 "process": "descrição do processo",
//                                 "ref": "referência",
//                                 "rev": 1
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Método Cadastrado"
//             }
//         }
//     },
//     "get": {
//         "summary": "Lista de métodos cadastrados",
//         "description": "Essa rota realiza a busca de métodos cadastrados no banco",
//         "tags": [
//             "Métodos de Analises"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/analysisMethod/{_id}": {
//     "get": {
//         "summary": "Busca de método por \"id\"",
//         "description": "Essa rota realiza a busca de método especifico",
//         "tags": [
//             "Métodos de Analises"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do método",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Cadastro de Métodos de Analises",
//         "description": "Essa rota realiza o cadstro de Métodos de Analises",
//         "tags": [
//             "Métodos de Analises"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do método",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/analysisMethod"
//                     },
//                     "examples": {
//                         "Atualizar Método": {
//                             "value": {
//                                 "process": "nova descrição do processo"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar método por \"id\"",
//         "description": "Essa rota deleta um método especifico",
//         "tags": [
//             "Métodos de Analises"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id do método",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/analysis": {
//     "post": {
//         "summary": "Cadastro de Analises",
//         "description": "Essa rota realiza o cadastro de Analises",
//         "tags": [
//             "Analises"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/analysis"
//                     },
//                     "examples": {
//                         "Criar Analise": {
//                             "value": {
//                                 "AnalysisMethod": "MA-0001",
//                                 "AnalysisType": "Quantitativa",
//                                 "name": "nome da analise",
//                                 "unit": "mgKOH/g"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "412": {
//                 "description": "Analise já existe"
//             },
//             "200": {
//                 "description": "Analise Cadastrada com sucesso"
//             }
//         }
//     },
//     "get": {
//         "summary": "Lista de analises cadastradas",
//         "description": "Essa rota realiza a busca de analises cadastradas no banco",
//         "tags": [
//             "Analises"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/analysis/{_id}": {
//     "get": {
//         "summary": "Busca de analise por \"id\"",
//         "description": "Essa rota realiza a busca de analise especifica",
//         "tags": [
//             "Analises"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da analise",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Cadastro de Analises",
//         "description": "Essa rota realiza o atualização de Analises",
//         "tags": [
//             "Analises"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da analise",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/analysis"
//                     },
//                     "examples": {
//                         "Atualizar Analise": {
//                             "value": {
//                                 "AnalysisMethod": "MA-0002"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar analise por \"id\"",
//         "description": "Essa rota deleta um analise especifica",
//         "tags": [
//             "Analises"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da analise",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/specification": {
//     "post": {
//         "summary": "Cadastro de Especificações",
//         "description": "Essa rota realiza o cadastro de Especificações",
//         "tags": [
//             "Especificações"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/specification"
//                     },
//                     "examples": {
//                         "Criar Especificação": {
//                             "value": {
//                                 "material": 15,
//                                 "specification": [
//                                     {
//                                         "_id": 1,
//                                         "active": true,
//                                         "AnalysisType": "Qualitativa",
//                                         "name": "cor",
//                                         "AnalysisMethod": "MA-0002",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:12.674Z",
//                                         "updatedAt": "2022-06-28T23:06:07.520Z",
//                                         "id": 1,
//                                         "__v": 0,
//                                         "updatedBy": "rasolive@gmail.com"
//                                     },
//                                     {
//                                         "_id": 2,
//                                         "active": true,
//                                         "AnalysisType": "Qualitativa",
//                                         "name": "Odor",
//                                         "AnalysisMethod": "MA-0004",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:29.731Z",
//                                         "updatedAt": "2022-06-28T21:14:29.731Z",
//                                         "id": 2,
//                                         "__v": 0
//                                     },
//                                     {
//                                         "_id": 3,
//                                         "active": true,
//                                         "name": "Aparência",
//                                         "AnalysisMethod": "MA-0005",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:42.624Z",
//                                         "updatedAt": "2022-06-28T21:15:32.587Z",
//                                         "id": 3,
//                                         "__v": 0,
//                                         "AnalysisType": "Qualitativa",
//                                         "updatedBy": "rasolive@gmail.com"
//                                     },
//                                     {
//                                         "_id": 4,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "pH",
//                                         "AnalysisMethod": "MA-0001",
//                                         "unit": "ph",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:53.334Z",
//                                         "updatedAt": "2022-06-28T21:14:53.334Z",
//                                         "id": 4,
//                                         "__v": 0,
//                                         "min": "4",
//                                         "max": "6"
//                                     },
//                                     {
//                                         "_id": 6,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "Densidade",
//                                         "AnalysisMethod": "MA-1008",
//                                         "unit": "g/ml",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:15:25.128Z",
//                                         "updatedAt": "2022-07-01T17:51:58.096Z",
//                                         "id": 6,
//                                         "__v": 0,
//                                         "updatedBy": "rasolive@gmail.com",
//                                         "min": "0.89",
//                                         "max": "1.01"
//                                     }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "412": {
//                 "description": "Eespecificação já existe"
//             },
//             "200": {
//                 "description": "Especificação Cadastrada com sucesso"
//             }
//         }
//     },
//     "get": {
//         "summary": "Lista de especificações cadastradas",
//         "description": "Essa rota realiza a busca de especificações cadastradas no banco",
//         "tags": [
//             "Especificações"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/specification/{_id}": {
//     "get": {
//         "summary": "Busca de especificação por \"id\"",
//         "description": "Essa rota realiza a busca de especificação especifica",
//         "tags": [
//             "Especificações"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da especificação",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Cadastro de Especificações",
//         "description": "Essa rota realiza o cadstro de Especificações",
//         "tags": [
//             "Especificações"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da especificação",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/specification"
//                     },
//                     "examples": {
//                         "Atualizar Especificação": {
//                             "value": {
//                                 "specification": [
//                                     {
//                                         "_id": 1,
//                                         "active": true,
//                                         "AnalysisType": "Qualitativa",
//                                         "name": "cor",
//                                         "AnalysisMethod": "MA-0002",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:12.674Z",
//                                         "updatedAt": "2022-06-28T23:06:07.520Z",
//                                         "id": 1,
//                                         "__v": 0,
//                                         "updatedBy": "rasolive@gmail.com"
//                                     },
//                                     {
//                                         "_id": 2,
//                                         "active": true,
//                                         "AnalysisType": "Qualitativa",
//                                         "name": "Odor",
//                                         "AnalysisMethod": "MA-0004",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:29.731Z",
//                                         "updatedAt": "2022-06-28T21:14:29.731Z",
//                                         "id": 2,
//                                         "__v": 0
//                                     },
//                                     {
//                                         "_id": 3,
//                                         "active": true,
//                                         "name": "Aparência",
//                                         "AnalysisMethod": "MA-0005",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:42.624Z",
//                                         "updatedAt": "2022-06-28T21:15:32.587Z",
//                                         "id": 3,
//                                         "__v": 0,
//                                         "AnalysisType": "Qualitativa",
//                                         "updatedBy": "rasolive@gmail.com"
//                                     },
//                                     {
//                                         "_id": 4,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "pH",
//                                         "AnalysisMethod": "MA-0001",
//                                         "unit": "ph",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:14:53.334Z",
//                                         "updatedAt": "2022-06-28T21:14:53.334Z",
//                                         "id": 4,
//                                         "__v": 0,
//                                         "min": "4",
//                                         "max": "6"
//                                     },
//                                     {
//                                         "_id": 6,
//                                         "active": true,
//                                         "AnalysisType": "Quantitativa",
//                                         "name": "Densidade",
//                                         "AnalysisMethod": "MA-1008",
//                                         "unit": "g/ml",
//                                         "createdBy": "rasolive@gmail.com",
//                                         "createdAt": "2022-06-28T21:15:25.128Z",
//                                         "updatedAt": "2022-07-01T17:51:58.096Z",
//                                         "id": 6,
//                                         "__v": 0,
//                                         "updatedBy": "rasolive@gmail.com",
//                                         "min": "0.89",
//                                         "max": "1.01"
//                                     }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar especificação por \"id\"",
//         "description": "Essa rota deleta um especificação especifica",
//         "tags": [
//             "Especificações"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da especificação",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/listas": {
//     "post": {
//         "summary": "Cadastro de Listas",
//         "description": "Essa rota realiza o cadastro de Listas",
//         "tags": [
//             "Listas"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/listas"
//                     },
//                     "examples": {
//                         "Criar Lista": {
//                             "value": {
//                                 "name": "Status Material2",
//                                 "lista": [
//                                     {
//                                         "id": "qyc0d5kfg",
//                                         "valor": "Em Criação",
//                                         "chave": "C"
//                                     },
//                                     {
//                                         "id": "b5efh01it",
//                                         "valor": "Em Linha",
//                                         "chave": "L"
//                                     },
//                                     {
//                                         "id": "wg3bunf4o",
//                                         "valor": "Fora de Uso",
//                                         "chave": "F"
//                                     }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "412": {
//                 "description": "Lista já existe"
//             },
//             "200": {
//                 "description": "lista Cadastrada"
//             }
//         }
//     },
//     "get": {
//         "summary": "Lista de listas cadastradas",
//         "description": "Essa rota realiza a busca de listas cadastradas no banco",
//         "tags": [
//             "Listas"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/listas/{_id}": {
//     "get": {
//         "summary": "Busca de lista por \"id\"",
//         "description": "Essa rota realiza a busca de lista especifico",
//         "tags": [
//             "Listas"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da lista",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Atualização de Listas",
//         "description": "Essa rota realiza a atualização de Listas",
//         "tags": [
//             "Listas"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da lista",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/listas"
//                     },
//                     "examples": {
//                         "Atualizar Lista": {
//                             "value": {
//                                 "lista": [
//                                     {
//                                         "id": "qyc0d5kfg",
//                                         "valor": "Em Criação",
//                                         "chave": "C"
//                                     },
//                                     {
//                                         "id": "b5efh01it",
//                                         "valor": "Em Linha",
//                                         "chave": "L"
//                                     }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar lista por \"id\"",
//         "description": "Essa rota deleta uma lista especifica",
//         "tags": [
//             "Listas"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da lista",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/users": {
//     "post": {
//         "summary": "Cadastro de Usuários",
//         "description": "Essa rota realiza o cadastro de Usuários",
//         "tags": [
//             "Usuários"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/users"
//                     },
//                     "examples": {
//                         "Criar Usuário": {
//                             "value": {
//                                 "email": "email@email.com",
//                                 "name": "novo usuário",
//                                 "password": "newPass",
//                                 "role": [
//                                     {
//                                         "id": "ypwjniwa7",
//                                         "perfil": "V"
//                                     }
//                                 ],
//                                 "validPass": false
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel criar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "412": {
//                 "description": "Usuário já existe"
//             },
//             "200": {
//                 "description": "usuário Cadastrado com sucesso"
//             }
//         }
//     },
//     "get": {
//         "summary": "Usuário de usuários cadastrados",
//         "description": "Essa rota realiza a busca de usuários cadastrados no banco",
//         "tags": [
//             "Usuários"
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// },
// "/users/{_id}": {
//     "get": {
//         "summary": "Busca de usuário por \"id\"",
//         "description": "Essa rota realiza a busca de usuário especifico",
//         "tags": [
//             "Usuários"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da usuário",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     },
//     "put": {
//         "summary": "Atualização de Usuários",
//         "description": "Essa rota realiza a atualização de Usuários",
//         "tags": [
//             "Usuários"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da usuário",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "requestBody": {
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/users"
//                     },
//                     "examples": {
//                         "Atualizar Usuário": {
//                             "value": {
//                                 "name": "usuário y"
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         "responses": {
//             "400": {
//                 "description": "Não foi possivel atualizar"
//             },
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "Atualizado com sucesso"
//             }
//         }
//     },
//     "delete": {
//         "summary": "Deletar usuário por \"id\"",
//         "description": "Essa rota deleta uma usuário especifico",
//         "tags": [
//             "Usuários"
//         ],
//         "parameters": [
//             {
//                 "name": "_id",
//                 "in": "path",
//                 "description": "id da usuário",
//                 "required": true
//             }
//         ],
//         "security": [
//             {
//                 "JWT": []
//             }
//         ],
//         "responses": {
//             "401": {
//                 "description": "Token não disponibilizado/inválido"
//             },
//             "200": {
//                 "description": "ok"
//             }
//         }
//     }
// }