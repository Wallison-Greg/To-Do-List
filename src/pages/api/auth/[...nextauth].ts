import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    secrets: process.env.JWT_SECRET as string,
}

export default NextAuth(authOptions);

/*
Basicamente nesse arquivo estamos passando o clientId e o clientSecret para dentro do provedor para ta fazendo a autenticação do usuario 

Passamos tambem o JWT para melhorar a segurança da informação 
*/