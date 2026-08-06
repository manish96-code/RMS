import React from 'react'

const Create = () => {
  return (
    <div>

        <form action="">
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="contact">Contact</label>
                <input type="text" name="contact" id="contact" />
            </div>
        </form>
      
    </div>
  )
}

export default Create
