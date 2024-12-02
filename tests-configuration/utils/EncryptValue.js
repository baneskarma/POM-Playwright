import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

export function createSalt() {
	const salt = randomBytes( 32 );
	process.env.SALT = salt.toString( 'hex' );
	// return salt;
}

export function encrypt( text, secretKey ) {
	try {
		const iv = randomBytes( 16 ); // Generate a random initialization vector
		const cipher = createCipheriv( 'aes-256-cbc', Buffer.from( secretKey, 'hex' ), iv );
		let encrypted = cipher.update( text );
		encrypted = Buffer.concat( [ encrypted, cipher.final() ] );
		return `${iv.toString( 'hex' )}:${encrypted.toString( 'hex' )}`;
	} catch ( error ) {
		console.error( 'Error in encrypt:', error );
		throw error;
	}
}

export function decrypt( text, secretKey ) {
	try {
		const textParts = text.split( ':' );
		const iv = Buffer.from( textParts.shift(), 'hex' );
		const encryptedText = Buffer.from( textParts.join( ':' ), 'hex' );
		const decipher = createDecipheriv( 'aes-256-cbc', Buffer.from( secretKey, 'hex' ), iv );
		let decrypted = decipher.update( encryptedText );
		decrypted = Buffer.concat( [ decrypted, decipher.final() ] );
		return decrypted.toString();
	} catch ( error ) {
		console.error( 'Error in decrypt:', error );
		throw error;
	}
}

// File Handling: You'll need to implement the logic to read and write the encrypted .env file using Node.js's fs module.
// Key Management: Consider using a secure key management solution or a password-protected key file to protect your secret key.
