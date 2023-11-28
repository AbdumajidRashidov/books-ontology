import { useRouter } from 'next/router'

const { useEffect, useState } = require('react')

const BookDetail = () => {
  const [book, setBook] = useState([])
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetch(`http://localhost:8000/books/${Number(id)}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)

        setBook(data.length > 1 ? data[1] : data[0])
      })
  }, [id])

  return (
    <div>
      <img src={book?.coverImageURL} width={300} height={400} alt={book?.title} />
      {book?.title && <h2>{book?.title}</h2>}
      {book?.author && (
        <p>
          <b>Authors:</b> {book?.author?.split('[').join('').split(']')}
        </p>
      )}
      {book?.averageRating && (
        <p>
          <b>Avarage Rating:</b> {book?.averageRating}
        </p>
      )}
      {book?.tags && (
        <p>
          <b>Genres:</b> {book?.tags?.split('[').join('').split(']')}
        </p>
      )}
      {book?.description && (
        <p>
          <b>Description: </b>
          {book?.description}
        </p>
      )}
      {book?.isbn && (
        <p>
          <b>ISBN:</b> {book?.isbn}
        </p>
      )}
      {book?.publisher && (
        <p>
          {' '}
          <b>Publisher:</b> {book?.publisher}
        </p>
      )}
      {book?.publishedDate && (
        <p>
          {' '}
          <b>Publication Date:</b> {book?.publicationDate}
        </p>
      )}
    </div>
  )
}

export default BookDetail
