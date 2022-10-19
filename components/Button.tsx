type ButtonProps = {
  variation?: 'primary' | 'secondary';
  children: String;
  size?: 'small' | 'medium' | 'large';
  customStyle?: String;
  onClick: () => void;
  [x: string]: any;
};

const Button = ({
  variation = 'primary',
  children,
  size = 'medium',
  customStyle = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`btn-${variation} drop-shadow-lg py-2 px-4 rounded ${customStyle}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
