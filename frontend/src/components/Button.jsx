const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all';

  const variants = {
    primary: 'bg-[#FC6CB4] text-white hover:bg-[#e85aa0]',
    secondary: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#731162]',
    outline: 'border-2 border-[#731162] text-[#731162] hover:bg-[#731162] hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
