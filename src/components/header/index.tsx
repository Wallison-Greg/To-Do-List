import React from 'react'
import styles from './styles.module.css'
import Link from 'next/link'

import { useSession, signIn, signOut } from 'next-auth/react'

type Props = {}

const Header = (props: Props) => {

  const {data: session, status} = useSession()

  return (
    <header className={styles.header}>
        <section className={styles.content}>
            <nav className={styles.nav}>
                <Link href='/'>
                  <h1 className={styles.logo}>
                    Tarefas <span>+</span>
                  </h1>
                </Link>
                {session?.user && (
                  <Link href='/dashboard' className={styles.link}>
                    Meu painel
                  </Link>
                )}
            </nav>
            {status === "loading" ? (
              <></>
            ): session ? (
              <button className={styles.loginButton} onClick={() => signOut()}>
                {session?.user?.name}
              </button>
            ): (
              <button className={styles.loginButton} onClick={() => signIn("google")}>
                Acessar
              </button>
            )}
            
        </section>
    </header>
  )
}

export default Header

/*
utilizamos o hoock "useSession" para verificar se tem algum usuario logado com ele recebemos se ha um usuario logado e recebemos o status da aplicação 

obs: esta havendo erro de autenticação via google 
*/