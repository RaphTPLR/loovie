function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  className = '',
  icon = null,
}) {
  const baseStyles = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/80 text-white',
    secondary: 'text-gray-500 hover:text-gray-700',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className} rounded-full`}
    >
      <div className="flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  )
}

export default Button
