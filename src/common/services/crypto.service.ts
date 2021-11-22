import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { nanoid } from 'nanoid/async';

const algorithm = 'aes-256-ctr';
const secretKey = 'this is a secret key :))))))))))';
const ivString = '9565de5577be69c86cb177e9b5004e23';

@Injectable()
export class CryptoService {
  static randomToken(size = 48) {
    const buffer = randomBytes(size);
    return buffer.toString('hex');
  }

  static encrypt(textToEncrypt) {
    const iv = Buffer.from(ivString, 'hex');
    const cipher = createCipheriv(algorithm, secretKey, iv);

    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    return encryptedText.toString('hex');
  }

  static decrypt(content: string) {
    const iv = Buffer.from(ivString, 'hex');
    const decipher = createDecipheriv(algorithm, secretKey, iv);
    const encryptedText = Buffer.from(content, 'hex');

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  static async generatorToken(size = 11): Promise<string> {
    // ~139 years needed, in order to have a 1% probability of at least one collision.
    const token = await nanoid(size);
    const tokenEncrypted = CryptoService.encrypt(token);
    return tokenEncrypted;
  }
}
