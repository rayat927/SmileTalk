import axios from 'axios'
import React from 'react'

export const getStaticPaths = async () => {
    const res = await axios.get('http://localhost:8000/users')
    const data = await res.data

    const paths = data.map(therapist => {
        return {
            params: {id: therapist._id.toString()}
        }
    })

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async (context) => {
    const id = context.params.id
    const res = await axios.get('http://localhost:8000/userId/' + id)
    const therapistData = await res.data
    const userData = {}
    if (therapistData.messages.length > 0){
        
    }
    
    return {
        props: {therapist: data}
    }
}

function TherapistRoom({therapist}) {
  return (
    <div>{therapist._id}</div>
  )
}

export default TherapistRoom