import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVarified?: boolean;

      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    isVarified?: boolean;

    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVarified?: boolean;

    username?: string;
  }
}
