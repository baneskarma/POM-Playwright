import fs from 'fs';
import dotenv from 'dotenv';
import { error } from 'console';
import { encrypt, decrypt } from './EncryptValue.js';
import crypto from 'crypto';

export function writeEncryptFile( file, decryptedEnv ) {
	try {
		const content = fs.readFileSync( file, 'utf8' );
		const lines = content.split( '\n' );

		const encryptedLines = lines.map( ( line ) => {
			if ( line.trim().startsWith( '#' ) || line.trim() === '' ) {
				return line;
			}

			const [ key, value ] = line.split( ' = ' );

			if ( key === 'SALT' ) {
				return `SALT = ${process.env.SALT}`;
			}

			// const derivedKey = await deriveKey(secretKey, process.env.SALT, 10000);
			let encryptedValue;
			if ( key && value && key != 'SALT' ) {
				if ( decryptedEnv ) {
					encryptedValue = encrypt( decryptedEnv[key], process.env.SALT );
				} else {
					encryptedValue = encrypt( value, process.env.SALT );
				}
				return `${key} = ${encryptedValue}`;
			}
			// return line;
		});
		fs.writeFileSync( file, encryptedLines.join( '\n' ), 'utf8' );
	} catch ( error ) {
		console.error( 'Error encrypting file:', error );
		throw new Error( error );
	}
}

export function writeDecryptFile( file ) {
	try {
		if ( !process.env.SALT ) {
			throw new Error( 'The correct SALT value is needed to decrypt the environment files.\nPlease contact someone who can provide it.' );
		}
		const content = fs.readFileSync( file, 'utf8' );
		const lines = content.split( '\n' );

		// Extract the SALT from the last line
		const saltLine = lines.pop();
		const salt = saltLine.split( ' = ' )[1];
		//process.env.SALT = salt;

		const decryptedLines = lines.map( ( line ) => {
			if ( line.trim().startsWith( '#' ) || line.trim() === '' ) {
				return line;
			}
			const [ key, value ] = line.split( ' = ' );
			if ( key === 'SALT' ) {
				return null;
			}
			if ( value ) {
				const decryptedValue = decrypt( value, process.env.SALT );
				return `${key} = ${decryptedValue}`;
			}
			return line;
		});
		//decryptedLines.push(`SALT=${process.env.SALT}`);
		fs.writeFileSync( file, decryptedLines.join( '\n' ), 'utf8' );
	} catch ( error ) {
		console.error( 'Error decrypting file:', error );
		throw new Error( error );
	}
}

export function decryptFile( file, returnDecrypted = false ) {
	try {
		if ( !process.env.SALT ) {
			throw new Error( 'The correct SALT value is needed to decrypt the environment files.\nPlease contact someone who can provide it.' );
		}
		const content = fs.readFileSync( file, 'utf8' );
		const lines = content.split( '\n' );
		const decryptedEnv = {};

		lines.forEach( ( line ) => {
			if ( line.trim().startsWith( '#' ) || line.trim() === '' ) {
				return;
			}
			const [ key, value ] = line.split( ' = ' );
			if ( key === 'SALT' ) {
				return;
			}
			if ( value ) {
				const decryptedValue = decrypt( value, process.env.SALT );
				decryptedEnv[key] = decryptedValue;
			}
		});

		Object.keys( decryptedEnv ).forEach( ( key ) => {
			process.env[key] = decryptedEnv[key]; // eslint-disable-line
		});

		if ( returnDecrypted ) {
			return decryptedEnv;
		}
	} catch ( error ) {
		console.error( 'Error decrypting file:', error );
		throw new Error( error );
	}
}

async function deriveKey( password, salt, iterations ) {
	return new Promise( ( resolve, reject ) => {
		crypto.pbkdf2( password, salt, iterations, 32, 'sha256', ( err, derivedKey ) => {
			if ( err ) reject( err );
			resolve( derivedKey );
		});
	});
}
