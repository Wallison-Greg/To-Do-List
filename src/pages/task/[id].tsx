import React, { ChangeEvent, FormEvent } from 'react'
import style from "../../styles/pages/task.module.css"
import { useState } from 'react'

//next
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { FaTrash } from 'react-icons/fa'

//firebase
import { db } from '@/services/firebase'
import { doc, collection, where, getDoc, addDoc, query, getDocs, deleteDoc} from 'firebase/firestore'

//components
import TextArea from "@/components/textarea"

//tipagem
type Props = {
    item: {
        tarefa: string,
        public: boolean,
        created: string
        user: string
        taskId: string
    };
    allComments: commentProps[]
}
interface commentProps {
    name: string,
    taskId: string,
    user: string,
    comment: string,
    id: string
}

const task = ({item, allComments}: Props) => {

    const {data: session} = useSession()
    const [input, setInput] =  useState("")
    const [comments, setComments] = useState<commentProps[]>(allComments || [])

    async function handlecomment(e: FormEvent) {
        e.preventDefault()
        
        if(input === '') return;

        if(!session?.user?.email || !session?.user?.name) return;

        try {
            //adicionando o comentario no banco
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            })

            setInput("")
            
        } catch (err) {
            
        }
    }

    async function handleDeleteComment(id: string){
        try {
            const docRef = doc(db, 'comments', id)
            await deleteDoc(docRef)

            const deleteComment = comments.filter((item) => item.id !== id)
            setComments(deleteComment)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className={style.container}>
        <Head>
            <title>Detalhes da tarefa</title>
        </Head>

        <main className={style.main}>
            <h1>tarefa</h1>
            <article className={style.task}>
                <p>{item.tarefa}</p>
            </article>
        </main>

        <section className={style.commentsContainer}>
            <h2>Deixe o seu comentario</h2>
            <form onSubmit={handlecomment}>
                <TextArea
                    placeholder='faça um comentario'
                    value={input}
                    onChange={(e:ChangeEvent<HTMLTextAreaElement>)=> setInput(e.target.value)}
                />
                <button className={style.btnComment} disabled={!session?.user}>Enviar Comentario</button>
            </form>
        </section>

        <section className={style.commentsContainer}>
            <h2>Todos os comentarios</h2>
            {comments.length == 0 && (
                <span>Nenhum comentario!</span>
            )}
            {comments.map((item) => (
                <article key={item.id} className={style.comment}>
                    <div className={style.headComment}>
                        <label className={style.nameComment}>{item.name}</label>
                        {item.user === session?.user?.email && (
                            <button className={style.btnTrash} onClick={() => handleDeleteComment(item.id)}>
                                <FaTrash size={18} color='#ea3140'/>
                            </button>
                        )}
                    </div>
                    <p>{item.comment}</p>
                </article>
            ))}
        </section>
    </div>
  )
}

export default task

//essa função tem como objetivo carregar informações do lado do servidor antes mesmo de renderizar a pagina, o famoso (SSR)
export const getServerSideProps: GetServerSideProps = async({params}) => {

    const id = params?.id as string //pegando o id da url

    const q = query(collection(db, 'comments'), where("taskId", "==", id))
    //filtrando todos os comentarios feito no post que recebe esse id

    const snapshotComments = await getDocs(q)//pegando todos os comentarios vindo pelo filtro

    let allComments: commentProps[] = []

    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            name: doc.data().name,
            user: doc.data().user,
            taskId: doc.data().taskId,
            comment: doc.data().comment
        })
    })

    const docRef = doc(db, "tarefas", id)

    const snapshot = await getDoc(docRef)

    if(snapshot.data() == undefined){//bloqueando acesso do usuario a essa pagina caso não esteja logado 
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    if(!snapshot.data()?.public){//bloqueando acesso aos posts privado 
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    //foramatando data
    const miliseconds = snapshot.data()?.created?.seconds * 1000;

    const detailsTask = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id
    }

    return {
        props:{
            item: detailsTask,
            allComments: allComments
        }
    }
}