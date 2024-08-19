import { expect, test } from '@playwright/test';
// test("Add 'Apple iPhone 7' to consumer account(B2C)", async ({request}) => {

// });

test('API GET Request', async ({ request }) => {
	const response = await request.get('https://reqres.in/api/users/2');

	expect(response.status()).toBe(200);

	const jsonResponse = await response.json();
	const text = await response.text();
	expect(text).toContain('Janet');

	console.log(jsonResponse);
	expect(await jsonResponse.data.first_name).toBe('Janet');
});

test('API POST Request', async ({ request }) => {
	const response = await request.post('https://reqres.in/api/users', {
		data: {
			name: 'Bane',
			job: 'Teacher',
		},
	});

	expect(response.status()).toBe(201);

	const text = await response.text();
	expect(text).toContain('Bane');

	console.log(await response.json());
});

test('API PUT Request', async ({ request }) => {
	const response = await request.post('https://reqres.in/api/users/2', {
		data: {
			name: 'Bane',
			job: 'Teacher',
		},
	});

	expect(response.status()).toBe(201);

	const text = await response.text();
	expect(text).toContain('Bane');

	console.log(await response.json());
});
