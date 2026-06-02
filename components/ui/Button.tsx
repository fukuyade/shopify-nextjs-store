type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gray-900 text-white hover:bg-gray-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-900 text-gray-900 hover:bg-gray-50',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        px-6 py-3 rounded-lg font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
