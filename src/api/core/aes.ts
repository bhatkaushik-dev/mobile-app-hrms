/**
 * AES password encryption — a faithful port of the web app's `AesUtil`.
 *
 * The backend expects the password encrypted with this exact scheme, so the
 * algorithm parameters (passphrase, iterations, key size) and the ciphertext
 * layout (base64 ciphertext + interleaved salt/iv suffix) must match the web
 * implementation byte-for-byte. The only change from the web version is the
 * CryptoJS source: an npm import instead of the `window.CryptoJS` global.
 */
import CryptoJS from 'crypto-js';

const GV_ITC = 1099; // PBKDF2 iterations
const GV_KS = 128 / 32; // key size in 32-bit words (128-bit key)
const GV_PW1 = 'FORTUNETECH SOLUTIONS PVT. LTD.';

function generateKey(salt: string, passTxt: string) {
  return CryptoJS.PBKDF2(passTxt, CryptoJS.enc.Hex.parse(salt), {
    keySize: GV_KS,
    iterations: GV_ITC,
  });
}

/**
 * Encrypt a plaintext password. Returns base64 ciphertext with a 64-char
 * suffix that interleaves the random salt (nacl) and IV so the server can
 * reconstruct the key — identical to the web client's wire format.
 */
export function encryptPassword(passTxt: string): string {
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
  const nacl = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
  const key = generateKey(nacl, GV_PW1);

  const encrypted = CryptoJS.AES.encrypt(passTxt, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  let cipherTxt = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  let shuffle = '';
  for (let i = 0; i < nacl.length; i++) {
    shuffle += nacl.charAt(i) + iv.charAt(i);
  }
  return cipherTxt + shuffle;
}
