import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../styles/pages/page.module.css";
import { GetStaticProps } from "next";

//importando as imagens
import heroImg from '../../public/assets/hero.png'

//firebase
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

//tipagem
interface homeProps {
  posts: number,
  comments: number
}


const inter = Inter({ subsets: ["latin"] });

export default function Home({posts, comments}: homeProps) {
  return (
    <div className={styles.container}>
      
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="logo tarefas"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>Sistema feita para voce organizar <br /> seus estudos ou  tarefas </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentarios</span>
          </section>
        </div>
      </main>

    </div>
  );
}


//pagina estatica: essa e mais uma das funcionalidades do next o "SSG" basicamente e função de gerar pagina estatica ou seja uma pagina de renderização rapida com seus valores estatico sendo atualizados de acordo com tempo definido 

export const getStaticProps: GetStaticProps = async () => {
  //ira buscar os valores do banco e mandar para os componentes
  const commentRef = collection(db, 'comments')
  const postRef = collection(db, 'tarefas')

  const commentSnapshot = await getDocs(commentRef)
  const postSnapshot = await getDocs(postRef)


  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60, //esse metodo ira definir de quanto em quanto tempo os valores serão recarregados no banco
  }
}