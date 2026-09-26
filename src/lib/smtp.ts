import { createConnection } from "node:net";
import { connect as tlsConnect, type TLSSocket } from "node:tls";
import type { Socket } from "node:net";

type Mail = {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
  to: string;
  subject: string;
  text: string;
};

function encodeSubject(subject: string) {
  if (/^[\x20-\x7e]+$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
}

function wrapSocket(sock: Socket | TLSSocket) {
  let buf = "";
  const waiters: Array<(line: string) => void> = [];
  sock.setEncoding("utf8");
  sock.on("data", (chunk: string) => {
    buf += chunk;
    let idx: number;
    while ((idx = buf.indexOf("\r\n")) >= 0) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const next = waiters.shift();
      if (next) next(line);
    }
  });
  return {
    sock,
    readLine: () =>
      new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("SMTP timeout")), 12_000);
        waiters.push((line) => {
          clearTimeout(timer);
          resolve(line);
        });
      }),
    write: (s: string) =>
      new Promise<void>((resolve, reject) => {
        sock.write(s, (err) => (err ? reject(err) : resolve()));
      }),
  };
}

async function readReply(session: ReturnType<typeof wrapSocket>) {
  const lines: string[] = [];
  while (true) {
    const line = await session.readLine();
    lines.push(line);
    if (/^\d{3} /.test(line)) break;
  }
  const last = lines[lines.length - 1] ?? "";
  const code = Number(last.slice(0, 3));
  return { code, text: lines.join("\n") };
}

async function expect(session: ReturnType<typeof wrapSocket>, ok: number[]) {
  const reply = await readReply(session);
  if (!ok.includes(reply.code)) {
    throw new Error(`SMTP ${reply.code}: ${reply.text}`);
  }
  return reply;
}

export async function sendSmtpMail(mail: Mail) {
  const raw = await new Promise<Socket>((resolve, reject) => {
    const sock = createConnection({ host: mail.host, port: mail.port }, () => resolve(sock));
    sock.setTimeout(12_000);
    sock.on("timeout", () => {
      sock.destroy();
      reject(new Error("SMTP connect timeout"));
    });
    sock.on("error", reject);
  });

  let session = wrapSocket(raw);
  await expect(session, [220]);
  await session.write(`EHLO roskyro\r\n`);
  const ehlo = await expect(session, [250]);

  if (mail.port !== 465 && /STARTTLS/i.test(ehlo.text)) {
    await session.write(`STARTTLS\r\n`);
    await expect(session, [220]);
    const tlsSock = await new Promise<TLSSocket>((resolve, reject) => {
      const upgraded = tlsConnect(
        { socket: raw, host: mail.host, servername: mail.host },
        () => resolve(upgraded),
      );
      upgraded.on("error", reject);
    });
    session = wrapSocket(tlsSock);
    await session.write(`EHLO roskyro\r\n`);
    await expect(session, [250]);
  }

  if (mail.user && mail.pass) {
    await session.write(`AUTH LOGIN\r\n`);
    await expect(session, [334]);
    await session.write(`${Buffer.from(mail.user).toString("base64")}\r\n`);
    await expect(session, [334]);
    await session.write(`${Buffer.from(mail.pass).toString("base64")}\r\n`);
    await expect(session, [235]);
  }

  await session.write(`MAIL FROM:<${mail.from}>\r\n`);
  await expect(session, [250]);
  await session.write(`RCPT TO:<${mail.to}>\r\n`);
  await expect(session, [250, 251]);
  await session.write(`DATA\r\n`);
  await expect(session, [354]);
  const body = [
    `From: ROSKYRO <${mail.from}>`,
    `To: ${mail.to}`,
    `Subject: ${encodeSubject(mail.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    mail.text.replace(/^\./gm, ".."),
    ".",
    "",
  ].join("\r\n");
  await session.write(body);
  await expect(session, [250]);
  await session.write(`QUIT\r\n`);
  session.sock.end();
}
