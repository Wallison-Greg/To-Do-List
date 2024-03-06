
import { HTMLProps } from 'react'
import styles from './styles.module.css'

const index = ({...rest}:HTMLProps<HTMLTextAreaElement>) => {
  return (
    <textarea className={styles.textarea} {...rest}></textarea>
  )
}

export default index