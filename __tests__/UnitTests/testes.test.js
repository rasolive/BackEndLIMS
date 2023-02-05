const request = require('supertest')
const db = require('../../Models')
const mongoose = require('mongoose');

require('dotenv').config({ path: '.env.test' })

const connString = process.env.CONN_STRING;
const API_v1 = "http://localhost:8089/v1"
const API = "http://localhost:8089"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Im5vbWUiLCJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInJvbGUiOlsiViJdLCJ2YWxpZFBhc3MiOnRydWUsImlhdCI6MTY3NTYwNTc4NSwiZXhwIjoxNjc1NjIzNzg1fQ.pQvf6He7SCiESObopDQ7-kZric4KIxrfPve_lysBL08"
const token_invalido = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Im5vbWUiLCJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInJvbGUiOlsiViJdLCJ2YWxpZFBhc3MiOnRydWUsImlhdCI6MTY3NTYwNTc4NSwiZXhwIjoxNjc1NjIzNzg1fQ.pQvf6He7SCiESObopDQ7-kZric4KIxrfPve_lysBL09"


describe('Dados', () => {
    it("Limpar banco de dados", async () => {
        const promise = mongoose.connect(connString, {
            dbName: process.env.MONGODB_SCHEMA,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await db.Fornecedores.deleteMany()
        await db.Users.deleteMany()
        await db.Lotes.deleteMany()
        await db.Materiais.deleteMany()
        await db.Listas.deleteMany()
        await db.Analysis.deleteMany()
        await db.AnalysisMethod.deleteMany()
        await db.Specification.deleteMany()

        await expect(promise).resolves.toBeInstanceOf(mongoose.Mongoose)

        await mongoose.connection.close()
    })
})

describe("Health", () => {
    it("Verificar se aplicação está no ar", async () => {

        const response = await request(API).get('/health')

        expectedResponse = { "healthy": true }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(200)

    })

})

describe("Autenticação", () => {
    it("Deve ser possível criar usuário", async () => {

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

    it("Deve autenticar o usuário", async () => {

        const response = await request(API_v1).post('/auth/authenticate')
            .send({
                "email": email,
                "password": "senha",
            })
            .set('Content-Type', 'application/json')

        expect(response.status).toBe(200)
        const token = response.body.token

    })

    it("Deve falhar ao autenticar, usuário não encontrado", async () => {

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

    it("Deve falhar ao autenticar, senha incorreta", async () => {

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
    it("Deve falhar ao utilizar token inválido", async () => {

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

    it("Deve ser possível cadastrar Fornecedor", async () => {

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

    it("Deve falhar ao criar fornecedor existente", async () => {

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

    })

    it("Deve listar fornecedores existentes", async () => {

        const response = await request(API_v1).get('/fornecedores')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar fornecedore específico", async () => {

        const response = await request(API_v1).get('/fornecedores/1')
            .set('Authorization', token)

        expectedResponse = '00.000.000/0000-01'
        expect(response.body.cnpj).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro do fornecedor sem alterar field cnpj", async () => {

        cnpj = "00.000.000/0000-01"
        const name = "novo nome do fornecedor"

        const response = await request(API_v1).put('/fornecedores/1')
            .send({
                "name": "novo nome do fornecedor",
                "cnpj": "00.000.000/0000-02"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.cnpj).toBe(cnpj)
        expect(response.body.name).toBe(name)
        expect(response.status).toBe(200)

    })

})

describe("Materiais", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const response = await request(API_v1).post('/materiais')
            .send({
                "armazenamento": "A",
                "fornecedor": [
                    1
                ],
                "name": "material x",
                "statusMaterial": "L",
                "umb": "G"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar material", async () => {

        const response = await request(API_v1).post('/materiais')
            .send({
                "armazenamento": "A",
                "fornecedor": [
                    1
                ],
                "name": "material x",
                "statusMaterial": "L",
                "umb": "G"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.cod).toBe('M10001')
        expect(response.status).toBe(200)

    })

    it("Deve listar materiais existentes", async () => {

        const response = await request(API_v1).get('/materiais')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar material específico", async () => {

        const response = await request(API_v1).get('/materiais/1')
            .set('Authorization', token)

        expectedResponse = 'M10001'
        expect(response.body.cod).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro do material sem alterar o field cod", async () => {

        cod = "M10001"
        const name = "material y"

        const response = await request(API_v1).put('/materiais/1')
            .send({
                "name": name,
                "cod": "M10002"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.cod).toBe(cod)
        expect(response.body.name).toBe(name)
        expect(response.status).toBe(200)

    })

})

describe("Lotes", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const response = await request(API_v1).post('/lotes')
            .send({
                "fornecedor": "1",
                "loteFornecedor": "xyz",
                "material": "1",
                "qtdInicial": 1000,
                "statusLote": "Q",
                "validade": "2023-03-24"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar lote", async () => {

        lote = 'LM1000001'

        const response = await request(API_v1).post('/lotes')
            .send({
                "fornecedor": "1",
                "loteFornecedor": "xyz",
                "material": "1",
                "qtdInicial": 1000,
                "statusLote": "Q",
                "validade": "2023-03-24"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.lote).toBe(lote)
        expect(response.status).toBe(200)

    })

    it("Deve listar lotes existentes", async () => {

        const response = await request(API_v1).get('/lotes')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar lote específico", async () => {

        const response = await request(API_v1).get('/lotes/1')
            .set('Authorization', token)

        expectedResponse = 'LM1000001'
        expect(response.body.lote).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro do Lote sem alterar o field lote", async () => {

        lote = "LM1000001"
        const qtdInicial = 2000

        const response = await request(API_v1).put('/lotes/1')
            .send({
                "qtdInicial": qtdInicial,
                "lote": "LM1000002"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.lote).toBe(lote)
        expect(response.body.qtdInicial).toBe(qtdInicial)
        expect(response.status).toBe(200)

    })

})

describe("Métodos de Analises", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const response = await request(API_v1).post('/analysisMethod')
            .send({
                "description": "nome da análise",
                "process": "descrição do processo",
                "ref": "referência",
                "rev": 1
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar método", async () => {

        const name = 'MA-1001'

        const response = await request(API_v1).post('/analysisMethod')
            .send({
                "description": "nome da análise",
                "process": "descrição do processo",
                "ref": "referência",
                "rev": 1
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.name).toBe(name)
        expect(response.status).toBe(200)

    })

    it("Deve listar métodos existentes", async () => {

        const response = await request(API_v1).get('/analysisMethod')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar método específico", async () => {

        const response = await request(API_v1).get('/analysisMethod/1')
            .set('Authorization', token)

        expectedResponse = 'MA-1001'
        expect(response.body.name).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro do método sem alterar o field name", async () => {

        const name = 'MA-1001'
        const process = "nova descrição do processo"

        const response = await request(API_v1).put('/analysisMethod/1')
            .send({
                "process": process,
                "name": 'MA-1002'
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.process).toBe(process)
        expect(response.status).toBe(200)

    })

})

describe("Analises", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const response = await request(API_v1).post('/analysis')
            .send({
                "AnalysisMethod": "MA-0001",
                "AnalysisType": "Quantitativa",
                "name": "nome da analise",
                "unit": "mgKOH/g"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar análise", async () => {

        const name = "nome da analise"

        const response = await request(API_v1).post('/analysis')
            .send({
                "AnalysisMethod": "MA-0001",
                "AnalysisType": "Quantitativa",
                "name": name,
                "unit": "mgKOH/g"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.name).toBe(name)
        expect(response.status).toBe(200)

    })

    it("Deve falhar ao criar análise existente", async () => {

        const name = "nome da analise"

        const response = await request(API_v1).post('/analysis')
            .send({
                "AnalysisMethod": "MA-0001",
                "AnalysisType": "Quantitativa",
                "name": name,
                "unit": "mgKOH/g"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expectedResponse = { error: 'Analysis already exists' }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(412)

    })

    it("Deve listar análises existentes", async () => {

        const response = await request(API_v1).get('/analysis')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar análise especifica", async () => {

        const response = await request(API_v1).get('/analysis/1')
            .set('Authorization', token)

        expectedResponse = "nome da analise"
        expect(response.body.name).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro do método sem alterar field name", async () => {

        const name = "nome da analise"
        const AnalysisMethod = "MA-0002"

        const response = await request(API_v1).put('/analysis/1')
            .send({
                "AnalysisMethod": "MA-0002",
                "name": "novo nome da analise"
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.AnalysisMethod).toBe(AnalysisMethod)
        expect(response.status).toBe(200)

    })

})

describe("Especificações", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const response = await request(API_v1).post('/specification')
            .send({
                "material": 1,
                "specification": [
                    {
                        "_id": 1,
                        "active": true,
                        "AnalysisType": "Qualitativa",
                        "name": "cor",
                        "AnalysisMethod": "MA-0002",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:12.674Z",
                        "updatedAt": "2022-06-28T23:06:07.520Z",
                        "id": 1,
                        "__v": 0,
                        "updatedBy": "rasolive@gmail.com"
                    },
                    {
                        "_id": 2,
                        "active": true,
                        "AnalysisType": "Qualitativa",
                        "name": "Odor",
                        "AnalysisMethod": "MA-0004",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:29.731Z",
                        "updatedAt": "2022-06-28T21:14:29.731Z",
                        "id": 2,
                        "__v": 0
                    },
                    {
                        "_id": 3,
                        "active": true,
                        "name": "Aparência",
                        "AnalysisMethod": "MA-0005",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:42.624Z",
                        "updatedAt": "2022-06-28T21:15:32.587Z",
                        "id": 3,
                        "__v": 0,
                        "AnalysisType": "Qualitativa",
                        "updatedBy": "rasolive@gmail.com"
                    },
                    {
                        "_id": 4,
                        "active": true,
                        "AnalysisType": "Quantitativa",
                        "name": "pH",
                        "AnalysisMethod": "MA-0001",
                        "unit": "ph",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:53.334Z",
                        "updatedAt": "2022-06-28T21:14:53.334Z",
                        "id": 4,
                        "__v": 0,
                        "min": "4",
                        "max": "6"
                    },
                    {
                        "_id": 6,
                        "active": true,
                        "AnalysisType": "Quantitativa",
                        "name": "Densidade",
                        "AnalysisMethod": "MA-1008",
                        "unit": "g/ml",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:15:25.128Z",
                        "updatedAt": "2022-07-01T17:51:58.096Z",
                        "id": 6,
                        "__v": 0,
                        "updatedBy": "rasolive@gmail.com",
                        "min": "0.89",
                        "max": "1.01"
                    }
                ]
            }

            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar especificação", async () => {

        const material = 1
        const response = await request(API_v1).post('/specification')
            .send({
                "material": material,
                "specification": [
                    {
                        "_id": 1,
                        "active": true,
                        "AnalysisType": "Qualitativa",
                        "name": "cor",
                        "AnalysisMethod": "MA-0002",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:12.674Z",
                        "updatedAt": "2022-06-28T23:06:07.520Z",
                        "id": 1,
                        "__v": 0,
                        "updatedBy": "rasolive@gmail.com"
                    },
                    {
                        "_id": 2,
                        "active": true,
                        "AnalysisType": "Qualitativa",
                        "name": "Odor",
                        "AnalysisMethod": "MA-0004",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:29.731Z",
                        "updatedAt": "2022-06-28T21:14:29.731Z",
                        "id": 2,
                        "__v": 0
                    },
                    {
                        "_id": 3,
                        "active": true,
                        "name": "Aparência",
                        "AnalysisMethod": "MA-0005",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:42.624Z",
                        "updatedAt": "2022-06-28T21:15:32.587Z",
                        "id": 3,
                        "__v": 0,
                        "AnalysisType": "Qualitativa",
                        "updatedBy": "rasolive@gmail.com"
                    },
                    {
                        "_id": 4,
                        "active": true,
                        "AnalysisType": "Quantitativa",
                        "name": "pH",
                        "AnalysisMethod": "MA-0001",
                        "unit": "ph",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:53.334Z",
                        "updatedAt": "2022-06-28T21:14:53.334Z",
                        "id": 4,
                        "__v": 0,
                        "min": "4",
                        "max": "6"
                    },
                    {
                        "_id": 6,
                        "active": true,
                        "AnalysisType": "Quantitativa",
                        "name": "Densidade",
                        "AnalysisMethod": "MA-1008",
                        "unit": "g/ml",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:15:25.128Z",
                        "updatedAt": "2022-07-01T17:51:58.096Z",
                        "id": 6,
                        "__v": 0,
                        "updatedBy": "rasolive@gmail.com",
                        "min": "0.89",
                        "max": "1.01"
                    }
                ]
            }

            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.material).toBe(material)
        expect(response.status).toBe(200)

    })

    it("Deve falhar ao criar especificação existente", async () => {


        const response = await request(API_v1).post('/specification')
            .send({
                "material": 1,
                "specification": [
                    {
                        "_id": 1,
                        "active": true,
                        "AnalysisType": "Qualitativa",
                        "name": "cor",
                        "AnalysisMethod": "MA-0002",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:12.674Z",
                        "updatedAt": "2022-06-28T23:06:07.520Z",
                        "id": 1,
                        "__v": 0,
                        "updatedBy": "rasolive@gmail.com"
                    },
                    {
                        "_id": 2,
                        "active": true,
                        "AnalysisType": "Qualitativa",
                        "name": "Odor",
                        "AnalysisMethod": "MA-0004",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:29.731Z",
                        "updatedAt": "2022-06-28T21:14:29.731Z",
                        "id": 2,
                        "__v": 0
                    },
                    {
                        "_id": 3,
                        "active": true,
                        "name": "Aparência",
                        "AnalysisMethod": "MA-0005",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:42.624Z",
                        "updatedAt": "2022-06-28T21:15:32.587Z",
                        "id": 3,
                        "__v": 0,
                        "AnalysisType": "Qualitativa",
                        "updatedBy": "rasolive@gmail.com"
                    },
                    {
                        "_id": 4,
                        "active": true,
                        "AnalysisType": "Quantitativa",
                        "name": "pH",
                        "AnalysisMethod": "MA-0001",
                        "unit": "ph",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:14:53.334Z",
                        "updatedAt": "2022-06-28T21:14:53.334Z",
                        "id": 4,
                        "__v": 0,
                        "min": "4",
                        "max": "6"
                    },
                    {
                        "_id": 6,
                        "active": true,
                        "AnalysisType": "Quantitativa",
                        "name": "Densidade",
                        "AnalysisMethod": "MA-1008",
                        "unit": "g/ml",
                        "createdBy": "rasolive@gmail.com",
                        "createdAt": "2022-06-28T21:15:25.128Z",
                        "updatedAt": "2022-07-01T17:51:58.096Z",
                        "id": 6,
                        "__v": 0,
                        "updatedBy": "rasolive@gmail.com",
                        "min": "0.89",
                        "max": "1.01"
                    }
                ]
            }

            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expectedResponse = { error: 'Specification already exists' }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(412)

    })

    it("Deve listar especificações existentes", async () => {

        const response = await request(API_v1).get('/specification')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar especificação especifica", async () => {

        const response = await request(API_v1).get('/specification/1')
            .set('Authorization', token)

        expectedResponse = 1
        expect(response.body.material).toStrictEqual(expectedResponse)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro da especificação sem alterar o field material", async () => {

        const material = 1
        const specification = [
            {
                "_id": 1,
                "active": true,
                "AnalysisType": "Qualitativa",
                "name": "cor",
                "AnalysisMethod": "MA-0002",
                "createdBy": "rasolive@gmail.com",
                "createdAt": "2022-06-28T21:14:12.674Z",
                "updatedAt": "2022-06-28T23:06:07.520Z",
                "id": 1,
                "__v": 0,
                "updatedBy": "rasolive@gmail.com"
            }
        ]

        const response = await request(API_v1).put('/specification/1')
            .send({
                "material": 2,
                "specification": specification
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.material).toBe(material)
        expect(response.body.specification).toStrictEqual(specification)
        expect(response.status).toBe(200)

    })

})

describe("Listas", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const name = "NomeLista"
        const response = await request(API_v1).post('/listas')
            .send({
                "name": name,
                "lista": [
                    {
                        "id": "qyc0d5kfg",
                        "valor": "Em Criação",
                        "chave": "C"
                    },
                    {
                        "id": "b5efh01it",
                        "valor": "Em Linha",
                        "chave": "L"
                    },
                    {
                        "id": "wg3bunf4o",
                        "valor": "Fora de Uso",
                        "chave": "F"
                    }
                ]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar Lista", async () => {

        const name = "NomeLista"
        const response = await request(API_v1).post('/listas')
            .send({
                "name": name,
                "lista": [
                    {
                        "id": "qyc0d5kfg",
                        "valor": "Em Criação",
                        "chave": "C"
                    },
                    {
                        "id": "b5efh01it",
                        "valor": "Em Linha",
                        "chave": "L"
                    },
                    {
                        "id": "wg3bunf4o",
                        "valor": "Fora de Uso",
                        "chave": "F"
                    }
                ]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.name).toBe(name)
        expect(response.status).toBe(200)

    })

    it("Deve falhar ao criar lista existente", async () => {

        const name = "NomeLista"
        const response = await request(API_v1).post('/listas')
            .send({
                "name": name,
                "lista": [
                    {
                        "id": "qyc0d5kfg",
                        "valor": "Em Criação",
                        "chave": "C"
                    },
                    {
                        "id": "b5efh01it",
                        "valor": "Em Linha",
                        "chave": "L"
                    },
                    {
                        "id": "wg3bunf4o",
                        "valor": "Fora de Uso",
                        "chave": "F"
                    }
                ]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expectedResponse = { error: 'List already exists' }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(412)

    })

    it("Deve listar listas existentes", async () => {

        const response = await request(API_v1).get('/listas')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar lista especifica", async () => {

        const response = await request(API_v1).get('/listas/1')
            .set('Authorization', token)

        const name = "NomeLista"
        expect(response.body.name).toStrictEqual(name)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro da lista sem alterar o field nome", async () => {

        const name = "NomeLista"
        const lista = [
            { id: 'qyc0d5kfg', valor: 'Em Criação', chave: 'C' }
        ]

        const response = await request(API_v1).put('/listas/1')
            .send({
                "name": "NomeListaNovo",
                "lista": lista
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.lista).toStrictEqual(lista)
        expect(response.status).toBe(200)

    })

})

describe("Usuários", () => {
    it("Deve falhar ao utilizar token inválido", async () => {

        const email = "email2@email.com"
        const name = "novo usuário"
        const response = await request(API_v1).post('/users')
            .send({
                "email": email,
                "name": name,
                "password": "Pass",
                "role": [
                    {
                        "id": "ypwjniwa7",
                        "perfil": "V"
                    }
                ],
                "validPass": false
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token_invalido)

        expectedResponse = {
            "error": "Token invalido"
        }
        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(401)

    })

    it("Deve ser possível cadastrar Usuário", async () => {

        const email = "email2@email.com"
        const name = "novo usuário"
        const response = await request(API_v1).post('/users')
            .send({
                "email": email,
                "name": name,
                "password": "Pass",
                "role": [
                    {
                        "id": "ypwjniwa7",
                        "perfil": "V"
                    }
                ],
                "validPass": false
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.message.name).toBe(name)
        expect(response.status).toBe(200)

    })

    it("Deve falhar ao criar usuário existente", async () => {

        const email = "email2@email.com"
        const name = "novo usuário"
        const response = await request(API_v1).post('/users')
            .send({
                "email": email,
                "name": name,
                "password": "Pass",
                "role": [
                    {
                        "id": "ypwjniwa7",
                        "perfil": "V"
                    }
                ],
                "validPass": false
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expectedResponse = { error: 'User already exists' }

        expect(response.body).toStrictEqual(expectedResponse)
        expect(response.status).toBe(412)

    })

    it("Deve listar usuários existentes", async () => {

        const response = await request(API_v1).get('/users')
            .set('Authorization', token)

        expect(response.status).toBe(200)

    })

    it("Deve listar usuário especifico", async () => {

        const response = await request(API_v1).get('/users/2')
            .set('Authorization', token)

        const email = "email2@email.com"
        expect(response.body.email).toStrictEqual(email)

        expect(response.status).toBe(200)

    })

    it("Deve ser possível alterar cadastro da usuário sem alterar o field email", async () => {

        const email = "email2@email.com"
        const name = "novo nome usuário"

        const response = await request(API_v1).put('/users/2')
            .send({
                "email": "novoEmail2@email.com",
                "name": name,
                "password": "Pass",
                "role": [
                    {
                        "id": "ypwjniwa7",
                        "perfil": "V"
                    }
                ],
                "validPass": false
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.email).toBe(email)
        expect(response.status).toBe(200)

    })

})

describe("Usuários", () => {
    it("Deve ser possível deletar usuário", async () => {

        const email = "email2@email.com"

        const response = await request(API_v1).delete('/users/2')
            .set('Authorization', token)

        expect(response.body.email).toBe(email)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Listas", () => {
    it("Deve ser possível deletar lista", async () => {

        const name = "NomeLista"

        const response = await request(API_v1).delete('/listas/1')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Especificações", () => {
    it("Deve ser possível deletar especificação", async () => {

        const material = 1

        const response = await request(API_v1).delete('/specification/1')
            .set('Authorization', token)

        expect(response.body.material).toBe(material)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Analises", () => {
    it("Deve ser possível deletar análise", async () => {

        const name = "nome da analise"

        const response = await request(API_v1).delete('/analysis/1')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Métodos de Analises", () => {
    it("Deve ser possível deletar método", async () => {

        const name = 'MA-1001'

        const response = await request(API_v1).delete('/analysisMethod/1')
            .set('Authorization', token)

        expect(response.body.name).toBe(name)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Lotes", () => {
    it("Deve ser possível deletar lote", async () => {

        lote = "LM1000001"

        const response = await request(API_v1).delete('/lotes/1')
            .set('Authorization', token)

        expect(response.body.lote).toBe(lote)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Materiais", () => {
    it("Deve ser possível deletar material", async () => {

        cod = "M10001"

        const response = await request(API_v1).delete('/materiais/1')
            .set('Authorization', token)

        expect(response.body.cod).toBe(cod)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})

describe("Fornecedores", () => {
    it("Deve ser possível deletar fornecedor", async () => {

        cnpj = "00.000.000/0000-01"

        const response = await request(API_v1).delete('/fornecedores/1')
            .set('Authorization', token)

        expect(response.body.cnpj).toBe(cnpj)
        expect(response.body.active).toBe(false)
        expect(response.status).toBe(200)

    })
})
