const request = require('supertest')
const API_v1 = "http://localhost:8089/v1"
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6Im5vbWUiLCJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInJvbGUiOlsiViJdLCJ2YWxpZFBhc3MiOnRydWUsImlhdCI6MTY3NTQ3MDk3NiwiZXhwIjoxNjc1NDg4OTc2fQ.JX81c2jC0vQ-Ihqm-OcMuxCnmwKTn4k9Y0OISAslc7k'




describe("Create User",  () => {
        it("deve ser possivel criar usuário", async () =>{

        const response = await request(API_v1).post('/auth/createUser')
        .send({
            "email": "email@email2.com",
            "name": "nome",
            "password": "senha",
            "validPass": true
            })
        .set('Content-Type', 'application/json')

        expect(response.status).toBe(200)
        
    })
    it("Deve falhar ao criar usuário já existente", async () =>{

        const response = await request(API_v1).post('/auth/createUser')
        .send({
            "email": "email@email2.com",
            "name": "nome",
            "password": "senha",
            "validPass": true
            })
        .set('Content-Type', 'application/json')

        expect(response.status).toBe(412)
        
    })
})

describe("GET Users",  () => {
    it("deve ser possivel listar usuários", async () =>{

    const response = await request(API_v1).get('/users')
    .set('Authorization', token)

    expect(response.status).toBe(200)
    
})

})