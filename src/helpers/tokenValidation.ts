import jwt, { Secret } from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  [key: string]: any; // This allows for other properties in the token
}

export async function validateTokenAndGetUserId(request: any): Promise<string | Error> {
  const token = request.cookies.get("token")?.value;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    if (!token) {
      throw new Error("No token found");
    }

    // Verify token
    const decodedToken = jwt.verify(token, jwtSecret as Secret) as DecodedToken;
    const userId = decodedToken._id;

    if (!userId) {
      throw new Error("Invalid token structure");
    }

    return userId;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
}
