
import {
  randomBytes,
  scryptSync,
  createHmac,
  timingSafeEqual
} from "node:crypto";

const secret = () => {
  if (
    !process.env.AUTH_SECRET ||
    process.env.AUTH_SECRET.length < 32
  ) {
    throw new Error(
      "AUTH_SECRET must be at least 32 characters"
    );
  }

  return process.env.AUTH_SECRET;
};

const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

export const generateSalt = () =>
  randomBytes(16).toString("hex");

export const hashPassword = (password, salt) =>
  scryptSync(password, salt, 64).toString("hex");

export const verifyPassword = (
  password,
  salt,
  stored
) => {
  const candidate = Buffer.from(
    hashPassword(password, salt),
    "hex"
  );

  const expected = Buffer.from(stored, "hex");

  return (
    candidate.length === expected.length &&
    timingSafeEqual(candidate, expected)
  );
};

export const makeToken = (id) => {
  const payload = encode({
    sub: String(id),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
  });

  const signature = createHmac(
    "sha256",
    secret()
  ).update(payload).digest("base64url");

  return `${payload}.${signature}`;
};

export function requireAuth(req, res, next) {
  try {
    const token = /^Bearer (.+)$/i.exec(
      req.headers.authorization || ""
    )?.[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    const [payload, signature, extra] = token.split(".");

    if (!payload || !signature || extra) {
      return res.status(401).json({
        error: "Invalid token"
      });
    }

    const expected = createHmac(
      "sha256",
      secret()
    ).update(payload).digest();

    const supplied = Buffer.from(
      signature,
      "base64url"
    );

    if (
      expected.length !== supplied.length ||
      !timingSafeEqual(expected, supplied)
    ) {
      return res.status(401).json({
        error: "Invalid token"
      });
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url")
        .toString("utf8")
    );

    if (
      !data.exp ||
      data.exp <= Date.now() / 1000 ||
      !/^[a-f\d]{24}$/i.test(data.sub)
    ) {
      return res.status(401).json({
        error: "Expired or invalid token"
      });
    }

    req.userId = data.sub;
    next();

  } catch {
    res.status(401).json({
      error: "Invalid token"
    });
  }
}
