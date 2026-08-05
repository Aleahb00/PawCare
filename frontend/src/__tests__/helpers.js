export function makeFakeJwt(payload) {
  const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const body = b64url(payload);
  return `${header}.${body}.fakesignature`;
}
