import { useState } from 'react'
import InputFile from '../../../components/InputFile'
import Button from '../../../components/Button'

function AddMovie({ onAddMovie, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rating: 0,
    imageUrl: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddMovie(formData)
    setFormData({ name: '', description: '', rating: 0, imageUrl: '' })
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-5 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-black rounded-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-6">Ajouter un film</h2>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Nom du film
            </label>
            <input
              className="bg-white/10 outline-none border-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <InputFile
            label="Cover du film"
            value={formData.imageUrl}
            onChange={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
          />

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="bg-white/10 outline-none border-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">
              Note
            </label>
            <div className="flex justify-start mb-4 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`cursor-pointer text-[2rem] ${
                    i < formData.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              onClick={onClose}
              variant="secondary"
              className="mr-4"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Ajouter le film
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMovie
