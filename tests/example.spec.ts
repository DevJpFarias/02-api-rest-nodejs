import { test, expect } from 'vitest'

test('O usuário consegue criar uma nova transação', () => {
  // fazer chamada HTTP para criar uma nova transação

	// Exemplo de resposta da rota, não chegaria assim!
	const responseStatusCode = 201

	// validação
	expect(responseStatusCode).toEqual(201)
})