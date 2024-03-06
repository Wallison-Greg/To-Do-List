import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../styles/pages/page.module.css";

//importando as imagens
import heroImg from '../../public/assets/hero.png'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comentarios</span>
          </section>
        </div>
      </main>

    </div>
  );
}
